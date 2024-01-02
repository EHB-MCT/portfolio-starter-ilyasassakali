const express = require("express");
const app = express();

const userRoutes = require("../routes/user");
const gameRoutes = require("../routes/game");

app.use(express.json());

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

// Start the server on port 3000
app.listen(3000, (err) => {
  if (!err) {
    console.log("running on port" + 3000);
  } else {
    console.log(err);
  }
});
