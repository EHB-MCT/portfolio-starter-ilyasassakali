const request = require("supertest");
const app = require("../src/app");

describe("POST /games/:userId", () => {
  it("should save a new game for a specific user", async () => {
    // Assume there is an existing user with ID 2 in the database
    const userId = 2;

    const gameData = {
      name: "ededede",
      image: "super_game_image.jpg",
      description: "An assains des templier normanss game",
      platform: "PC",
      rating: 4,
    };

    const response = await request(app)
      .post(`/games/${userId}`)
      .send(gameData)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.user_id).toEqual(userId);
    expect(response.body.name).toEqual(gameData.name);
  });

  it("should return a 400 Bad Request if required fields are missing", async () => {
    const userId = 2;

    const invalidGameData = {
      // Missing required fields
    };

    await request(app)
      .post(`/games/${userId}`)
      .send(invalidGameData)
      .expect(400);
  });

  it("should return a 404 Not Found if the user with the provided ID is not found", async () => {
    const invalidUserId = 999; // Assuming this user ID does not exist

    const gameData = {
      name: "Test Game",
      image: "https://example.com/game.jpg",
      description: "This is a test game",
      platform: "PC",
      rating: 4.5,
    };

    await request(app)
      .post(`/games/${invalidUserId}`)
      .send(gameData)
      .expect(404);
  });
});
