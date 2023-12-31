class Game {
  constructor(userId, name, image, description, platform, rating) {
    this.userId = userId;
    this.name = name;
    this.image = image;
    this.description = description;
    this.platform = platform;
    this.rating = rating;
  }
}

module.exports = Game;
