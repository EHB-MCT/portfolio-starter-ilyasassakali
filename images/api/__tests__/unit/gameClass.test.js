const Game = require("../../classes/Game");

describe("Game Class", () => {
  it("should create a new Game instance with correct properties", () => {
    const userId = 1;
    const name = "Test Game";
    const image = "test_game_image.jpg";
    const description = "This is a test game";
    const platform = "PC";
    const rating = 4.5;

    const gameInstance = new Game(
      userId,
      name,
      image,
      description,
      platform,
      rating
    );

    expect(gameInstance.userId).toEqual(userId);
    expect(gameInstance.name).toEqual(name);
    expect(gameInstance.image).toEqual(image);
    expect(gameInstance.description).toEqual(description);
    expect(gameInstance.platform).toEqual(platform);
    expect(gameInstance.rating).toEqual(rating);
  });
});
