const request = require("supertest");
const app = require("../src/app");

describe("POST /users", () => {
  it("should create a new user if the user does not exist", async () => {
    // Test data to create a new user
    const userData = {
      username: "testuser",
      email: "test@example.com",
      password: "testpassword",
    };

    // Send a POST request to the /users endpoint to create a new user
    const response = await request(app).post("/users").send(userData);

    // Check if the response status is 201 (Created)
    expect(response.status).toBe(201);

    // Check if the response contains the expected properties for a new user
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("username", userData.username);
    expect(response.body).toHaveProperty("email", userData.email);
    expect(response.body).toHaveProperty(
      "message",
      "User created successfully"
    );
  });

  it("should return an error if the user with the same email already exists", async () => {
    // Test data to create an existing user
    const existingUserData = {
      username: "existinguser",
      email: "existing@example.com",
      password: "existingpassword",
    };

    // Create a user with the specified email to simulate an existing user
    await request(app).post("/users").send(existingUserData);

    // Send a POST request to the /users endpoint with the same email
    const response = await request(app).post("/users").send(existingUserData);

    // Check if the response status is 409 (Conflict)
    expect(response.status).toBe(409);

    // Check if the response contains the expected error
    expect(response.body).toHaveProperty(
      "error",
      "User with this email already exists"
    );
  });

  it("should return an error if required fields are missing", async () => {
    // Test data with missing required fields
    const incompleteUserData = {
      username: "incompleteuser",
      // Missing email and password
    };

    // Send a POST request to the /users endpoint with missing fields
    const response = await request(app).post("/users").send(incompleteUserData);

    // Check if the response status is 400 (Bad Request)
    expect(response.status).toBe(400);

    // Check if the response contains the expected error for missing required fields
    expect(response.body).toHaveProperty("error", "Missing required fields");
  });
});
