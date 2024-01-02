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
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the process.
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
 * @param {object} req.body - The request body containing user information.
 *   - {string} username - The username of the new user.
 *   - {string} email - The email of the new user.
 *   - {string} password - The password of the new user.
 * @returns {object} - Created user.
 * @throws {object} - Returns a 400 Bad Request if required fields are missing.
 * @throws {object} - Returns a 409 Conflict if a user with the provided email already exists.
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the process.
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
 * @param {number} req.params.id - The ID of the user to be deleted.
 * @returns {object} - Message indicating success or failure.
 * @throws {object} - Returns a 404 Not Found if the user with the provided ID is not found.
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the process.
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
 * @param {number} req.params.id - The ID of the user to be updated.
 * @param {object} req.body - The updated user information.
 * @returns {object} - The updated user.
 * @throws {object} - Returns a 404 Not Found if the user with the provided ID is not found.
 * @throws {object} - Returns a 409 Conflict if the specified email is already in use by another user.
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the process.
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
 * @throws {object} - Returns a 400 Bad Request if the required fields (email or password) are missing.
 * @throws {object} - Returns a 404 Not Found if the user with the provided email is not found.
 * @throws {object} - Returns a 401 Unauthorized if the provided password does not match the stored hashed password.
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the login process.
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
