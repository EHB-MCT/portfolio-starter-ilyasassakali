const express = require("express");
const router = express.Router();
const knex = require("knex");
const knexfile = require("../knexfile");
const db = knex(knexfile.development);
const bcrypt = require("bcrypt");
const User = require("../classes/User");

const SALT_ROUNDS = 10;

/**
 * Endpoint to retrieve the list of users.
 *
 * @returns {object} - List of users.
 */
router.get("/", async (req, res) => {
  try {
    const usersData = await db("users").select("*");

    const users = usersData.map(
      (user) => new User(user.username, user.email, user.password)
    );

    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to create a new user.
 *
 * @returns {object} - Created user.
 */
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const existingUser = await db("users").where("email", email).first();
    if (existingUser) {
      return res
        .status(409)
        .send({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUserInstance = new User(username, email, hashedPassword);

    const [newUser] = await db("users")
      .insert({
        username: newUserInstance.username,
        email: newUserInstance.email,
        password: newUserInstance.password,
      })
      .returning(["id", "username", "email"]);

    res.status(201).send({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to delete a user by ID.
 *
 * @param {number} id - User ID.
 * @returns {object} - Message indicating success or failure.
 */
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const existingUser = await db("users").where("id", userId).first();
    if (!existingUser) {
      return res.status(404).send({ error: "User not found" });
    }

    await db("users").where("id", userId).del();

    res.send({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to update a user by ID.
 *
 * @param {number} id - User ID.
 * @param {object} req.body - Updated user information.
 * @returns {object} - Updated user.
 */
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    const existingUser = await db("users").where("id", userId).first();
    if (!existingUser) {
      return res.status(404).send({ error: "User not found" });
    }

    const emailInUse = await db("users")
      .where("email", email)
      .whereNot("id", userId)
      .first();
    if (emailInUse) {
      return res
        .status(409)
        .send({ error: "Email is already in use by another user" });
    }

    // Hash the new password if provided
    const hashedPassword = password
      ? await bcrypt.hash(password, SALT_ROUNDS)
      : existingUser.password;

    await db("users")
      .where("id", userId)
      .update({
        username: username || existingUser.username,
        email: email || existingUser.email,
        password: hashedPassword,
      });

    const updatedUser = await db("users").where("id", userId).first();

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to log in a user.
 *
 * @returns {object} - User information if login is successful.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const user = await db("users").where("email", email).first();

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Compare Hashed passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    res.send({
      id: user.id,
      username: user.username,
      email: user.email,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
