const request = require("supertest");
const app = require("../src/app");

describe("GET /games/:userId", () => {
  it("should retrieve all games for a specific user", async () => {
    // Assume there is an existing user with ID 14 in the database
    const userId = 14;

    const response = await request(app).get(`/games/${userId}`).expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it("should return a 404 Not Found if the user with the provided ID is not found", async () => {
    const userId = 999; // Assuming this user ID does not exist

    await request(app).get(`/games/${userId}`).expect(404);
  });
});
