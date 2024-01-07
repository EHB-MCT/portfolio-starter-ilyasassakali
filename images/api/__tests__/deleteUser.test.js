const request = require("supertest");
const app = require("../src/app");

describe("DELETE /users/:id", () => {
  it("should delete a user if the user is found", async () => {
    // Test data to create a user for deletion
    const userData = {
      username: "deleteuser",
      email: "delete@example.com",
      password: "deletepassword",
    };

    // Create a user to be deleted
    const createUserResponse = await request(app).post("/users").send(userData);

    // Send a DELETE request to the /users/:id endpoint to delete the user
    const deleteResponse = await request(app).delete(
      `/users/${createUserResponse.body.id}`
    );

    // Check if the response status is 200 (OK)
    expect(deleteResponse.status).toBe(200);

    // Check if the response contains the expected message for successful deletion
    expect(deleteResponse.body).toHaveProperty(
      "message",
      "User deleted successfully"
    );
  });

  it("should return an error if the user is not found", async () => {
    // Send a DELETE request to the /users/:id endpoint with an invalid ID
    const deleteResponse = await request(app).delete("/users/9999");

    // Check if the response status is 404 (Not Found)
    expect(deleteResponse.status).toBe(404);

    // Check if the response contains the expected error for user not found
    expect(deleteResponse.body).toHaveProperty("error", "User not found");
  });

  it("should return an error if an internal server error occurs", async () => {
    // Mock a database error by passing an invalid ID (non-numeric)
    const deleteResponse = await request(app).delete("/users/invalidID");

    // Check if the response status is 500 (Internal Server Error)
    expect(deleteResponse.status).toBe(500);

    // Check if the response contains the expected error for internal server error
    expect(deleteResponse.body).toHaveProperty(
      "error",
      "Internal Server Error"
    );
  });
});
