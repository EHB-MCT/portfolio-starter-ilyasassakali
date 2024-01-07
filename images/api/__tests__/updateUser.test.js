const request = require("supertest");
const app = require("../src/app");

describe("PUT /users/:id", () => {
  it("should update an existing user", async () => {
    // Test data to create an existing user
    const existingUserData = {
      username: "secondexistinguser",
      email: "secondexisting@example.com",
      password: "secondexistingpassword",
    };

    // Create an existing user
    const createUserResponse = await request(app)
      .post("/users")
      .send(existingUserData);

    // Updated data for the existing user
    const updatedUserData = {
      username: "updateduser",
      email: "updated@example.com",
      password: "updatedpassword",
    };

    // Extract the user ID from the response of the first request
    const userId = createUserResponse.body.id;

    // Send a PUT request to the /users/:id endpoint to update the existing user
    const updateResponse = await request(app)
      .put(`/users/${userId}`) // Use the extracted user ID here
      .send(updatedUserData);

    // Check if the response status is 200 (OK)
    expect(updateResponse.status).toBe(200);

    // Check if the response contains the expected updated user properties
    expect(updateResponse.body).toHaveProperty("id", userId);
    expect(updateResponse.body).toHaveProperty(
      "username",
      updatedUserData.username
    );
    expect(updateResponse.body).toHaveProperty("email", updatedUserData.email);
  });

  it("should return an error if the user is not found", async () => {
    // Test data for updating a non-existing user
    const nonExistingUserData = {
      username: "nonexistinguser",
      email: "nonexisting@example.com",
      password: "nonexistingpassword",
    };

    // Send a PUT request to the /users/:id endpoint with an invalid ID
    const updateResponse = await request(app)
      .put("/users/9999")
      .send(nonExistingUserData);

    // Check if the response status is 404 (Not Found)
    expect(updateResponse.status).toBe(404);

    // Check if the response contains the expected error for user not found
    expect(updateResponse.body).toHaveProperty("error", "User not found");
  });

  it("should return an error if the specified email is already in use by another user", async () => {
    // Test data to create an existing user
    const existingUserData = {
      username: "thirdexistinguser",
      email: "thirdexistinguser@example.com",
      password: "thirdexistingpassword",
    };

    // Create an existing user
    const createUserResponse = await request(app)
      .post("/users")
      .send(existingUserData);

    // Attempt to update the user with an email that is already in use
    const conflictingEmailUserData = {
      username: "conflictinguser",
      email: "existing@gmail.com", // Using the same email as an existing user of the db
      password: "conflictingpassword",
    };

    // Send a PUT request to the /users/:id endpoint with conflicting email
    const updateResponse = await request(app)
      .put(`/users/${createUserResponse.body.id}`)
      .send(conflictingEmailUserData);

    // Check if the response status is 409 (Conflict)
    expect(updateResponse.status).toBe(409);

    // Check if the response contains the expected error for conflicting email
    expect(updateResponse.body).toHaveProperty(
      "error",
      "Email is already in use by another user"
    );
  });
});
