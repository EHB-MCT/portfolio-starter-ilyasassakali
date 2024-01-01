const express = require("express");
const app = express();

const userRoutes = require("../routes/user");
app.use(express.json());

/**
 * Root endpoint for a simple hello world message.
 *
 * @returns {object} - Hello world message.
 */
app.get("/", (req, res) => {
  res.send({ message: "Hello, world!" });
});

app.use("/users", userRoutes);

app.listen(3000, (err) => {
  if (!err) {
    console.log("running on port" + 3000);
  } else {
    console.log(err);
  }
});
