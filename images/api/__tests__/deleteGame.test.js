const request = require("supertest");
const app = require("../src/app");

describe("DELETE /games/:userId/:gameId", () => {
  it("should delete a game for a specific user", async () => {
    // Assume there is an existing user with ID 14 in the database
    const userId = 14;

    // Assume there is an existing game with ID 1 in the database
    const gameId = 1;

    const response = await request(app)
      .delete(`/games/${userId}/${gameId}`)
      .expect(200);

    expect(response.body).toHaveProperty(
      "message",
      "Game deleted successfully"
    );
  });

  it("should return a 404 Not Found if the user with the provided ID is not found", async () => {
    const userId = 999; // Assuming this user ID does not exist

    // Assume there is an existing game with ID 1 in the database
    const gameId = 1;

    await request(app).delete(`/games/${userId}/${gameId}`).expect(404);
  });

  it("should return a 404 Not Found if the game with the provided ID is not found", async () => {
    // Assume there is an existing user with ID 14 in the database
    const userId = 14;

    const gameId = 999; // Assuming this game ID does not exist

    await request(app).delete(`/games/${userId}/${gameId}`).expect(404);
  });

  it("should return a 403 Forbidden if the game does not belong to the user", async () => {
    // Assume there is an existing user with ID 14 in the database
    const userId = 14;

    // Assume there is an existing game with ID 70 in the database
    const gameId = 70;

    await request(app).delete(`/games/${userId}/${gameId}`).expect(403);
  });
});
