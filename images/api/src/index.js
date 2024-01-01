const express = require("express");
const knex = require("knex");
const knexfile = require("../knexfile");
const app = express();
const db = knex(knexfile.development);
app.use(express.json());

const User = require("../classes/User");

/**
 * Root endpoint for a simple hello world message.
 *
 * @returns {object} - Hello world message.
 */
app.get("/", (req, res) => {
  res.send({ message: "Hello, world!" });
});

/**
 * Endpoint to retrieve the list of users.
 *
 * @returns {object} - List of users.
 */
app.get("/users", async (req, res) => {
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

app.listen(3000, (err) => {
  if (!err) {
    console.log("running on port" + 3000);
  } else {
    console.log(err);
  }
});
