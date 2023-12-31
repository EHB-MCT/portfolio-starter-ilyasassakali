const express = require("express");
const router = express.Router();
const knex = require("knex");
const knexfile = require("../knexfile");
const db = knex(knexfile.development);
const Game = require("../classes/Game");

/**
 * Endpoint to save a game for a specific user.
 *
 * @param {string} userId - The ID of the user for whom the game is being saved.
 * @param {object} req.body - The game information to be saved.
 * @param {string} req.body.name - The name of the game.
 * @param {string} req.body.image - The image URL of the game.
 * @param {string} req.body.description - The description of the game.
 * @param {string} req.body.platform - The platform on which the game is played.
 * @param {number} req.body.rating - The rating assigned to the game.
 * @returns {object} - Saved game information.
 * @throws {object} - Returns a 400 Bad Request if any of the required fields are missing.
 * @throws {object} - Returns a 404 Not Found if the user with the provided ID is not found.
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the game save process.
 */
router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, image, description, platform, rating } = req.body;

    if (!name || !image || !description || !platform || !rating) {
      return res.status(400).send({ error: "Missing required fields" });
    }

    const user = await db("users").where("id", userId).first();
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const newGameInstance = new Game(
      userId,
      name,
      image,
      description,
      platform,
      rating
    );

    const [newGame] = await db("games")
      .insert({
        user_id: newGameInstance.userId,
        name: newGameInstance.name,
        image: newGameInstance.image,
        description: newGameInstance.description,
        platform: newGameInstance.platform,
        rating: newGameInstance.rating,
      })
      .returning([
        "id",
        "user_id",
        "name",
        "image",
        "description",
        "platform",
        "rating",
      ]);

    res.status(201).send({
      id: newGame.id,
      user_id: newGame.user_id,
      name: newGame.name,
      image: newGame.image,
      description: newGame.description,
      platform: newGame.platform,
      rating: newGame.rating,
      message: "Game saved successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to delete a game saved by a specific user.
 *
 * @param {string} userId - The ID of the user who saved the game.
 * @param {string} gameId - The ID of the game to be deleted.
 * @returns {object} - Message indicating success or failure.
 * @throws {object} - Returns a 404 Not Found if the user with the provided ID or the game with the provided ID is not found.
 * @throws {object} - Returns a 403 Forbidden if the game does not belong to the user.
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the game deletion process.
 */
router.delete("/:userId/:gameId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const gameId = req.params.gameId;

    const user = await db("users").where("id", userId).first();
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const game = await db("games").where("id", gameId).first();
    if (!game) {
      return res.status(404).send({ error: "Game not found" });
    }

    if (game.user_id != userId) {
      return res
        .status(403)
        .send({ error: "Unauthorized - Game does not belong to the user" });
    }

    await db("games").where("id", gameId).del();

    res.send({ message: "Game deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to retrieve all games saved by a specific user.
 *
 * @param {string} userId - The ID of the user for whom to retrieve the games.
 * @returns {object} - List of games saved by the user.
 * @throws {object} - Returns a 404 Not Found if the user with the provided ID is not found.
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the retrieval process.
 */
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await db("users").where("id", userId).first();
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const games = await db("games").where("user_id", userId);

    res.send(games);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

/**
 * Endpoint to update a saved game by a specific user.
 *
 * @param {string} userId - The ID of the user who owns the game to be updated.
 * @param {string} gameId - The ID of the game to be updated.
 * @param {object} req.body - The updated information for the game.
 * @returns {object} - Updated game information.
 * @throws {object} - Returns a 404 Not Found if the user or game with the provided IDs is not found.
 * @throws {object} - Returns a 403 Forbidden if the game does not belong to the specified user.
 * @throws {object} - Returns a 500 Internal Server Error if an error occurs during the update process.
 */
router.put("/:userId/:gameId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const gameId = req.params.gameId;
    const { name, image, description, platform, rating } = req.body;

    const user = await db("users").where("id", userId).first();
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const game = await db("games").where("id", gameId).first();
    if (!game) {
      return res.status(404).send({ error: "Game not found" });
    }

    if (game.user_id != userId) {
      return res
        .status(403)
        .send({ error: "Unauthorized - Game does not belong to the user" });
    }

    const updatedGameInstance = new Game(
      userId,
      name || game.name,
      image || game.image,
      description || game.description,
      platform || game.platform,
      rating || game.rating
    );

    const [updatedGame] = await db("games")
      .where("id", gameId)
      .update({
        user_id: updatedGameInstance.userId,
        name: updatedGameInstance.name,
        image: updatedGameInstance.image,
        description: updatedGameInstance.description,
        platform: updatedGameInstance.platform,
        rating: updatedGameInstance.rating,
      })
      .returning([
        "id",
        "user_id",
        "name",
        "image",
        "description",
        "platform",
        "rating",
      ]);

    res.send({
      id: updatedGame.id,
      user_id: updatedGame.user_id,
      name: updatedGame.name,
      image: updatedGame.image,
      description: updatedGame.description,
      platform: updatedGame.platform,
      rating: updatedGame.rating,
      message: "Game updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
