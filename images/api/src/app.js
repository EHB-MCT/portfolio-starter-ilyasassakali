const express = require("express");
const app = express();
const cors = require("cors");

const userRoutes = require("../routes/user");
const gameRoutes = require("../routes/game");

app.use(express.json());
app.use(cors());

/**
 * Root endpoint for a simple hello world message.
 *
 * @returns {object} - Hello world message.
 */
app.get("/", (req, res) => {
  res.send({ message: "Hello, world!" });
});

// Connect user and game routes
app.use("/users", userRoutes);
app.use("/games", gameRoutes);

module.exports = app;
