const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("games").del();
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      username: "user1",
      email: "user1@example.com",
      password: await bcrypt.hash("user1", 10),
    },
    {
      username: "user2",
      email: "user2@example.com",
      password: await bcrypt.hash("user2", 10),
    },
  ]);

  await knex("games").insert([
    {
      user_id: 1,
      name: "Mario Kart 8 Deluxe",
      image:
        "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_MarioKart8Deluxe.jpg",
      description: "Description 1",
      platform: "Nintendo Switch",
      rating: 8,
    },
    {
      user_id: 1,
      name: "Fortnite",
      image:
        "https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_download_software_1/2x1_NSwitchDS_Fortnite_image1600w.jpg",
      description: "Description 2",
      platform: "PC",
      rating: 4,
    },
    {
      user_id: 2,
      name: "Assassin's Creed Mirage",
      image: "https://cdn.gamerwk.com/2022/09/AC-Mirage-Diumumin-Resmi.jpg",
      description: "Description 3",
      platform: "PS5",
      rating: 3,
    },
    {
      user_id: 2,
      name: "FC 24",
      image:
        "https://cdn.alza.cz/Foto/ImgGalery/Image/ea-sports-fc-24-cover_1.jpg",
      description: "Description 4",
      platform: "XBOX SERIES X",
      rating: 2,
    },
  ]);
};
