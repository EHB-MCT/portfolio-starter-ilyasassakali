import React, { useEffect, useState } from "react";
import "../home/Home.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import GameSaveModal from "../gameSaveModal/GameSaveModal";
import GameUpdateModal from "../gameUpdateModal/GameUpdateModal";

function Home() {
  const [games, setGames] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleGameSave = (savedGameData) => {
    setGames((prevGames) => [...prevGames, savedGameData]);
  };

  const handleSaveSuccess = () => {
    setSuccessMessage("Game saved successfully");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleGameDelete = async (userId, gameId) => {
    try {
      const response = await fetch(
        `http://localhost/games/${userId}/${gameId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const remainingGames = games.filter((game) => game.id !== gameId);
        setGames(remainingGames);
        setSuccessMessage("Game deleted successfully");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        const errorData = await response.json();
        console.error("Error deleting game:", errorData.error);
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    }
  };

  const handleGameUpdate = (game) => {
    setGames((prevGames) =>
      prevGames.map((g) => (g.id === game.id ? game : g))
    );
    setSuccessMessage("Game updated successfully");
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost/games/${user.id}`);
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="home">
      <Navbar />

      <h2>Saved Games</h2>
      <GameSaveModal
        onSave={handleGameSave}
        onSaveSuccess={handleSaveSuccess}
      />
      <div className="card-container">
        {games.map((game) => (
          <Card
            key={game.id}
            bg="dark"
            data-bs-theme="dark"
            style={{ width: "25rem" }}
          >
            <Card.Img src={game.image} />
            <Card.Body>
              <Card.Title className="titleCard">{game.name}</Card.Title>
              <Card.Text>{game.description}</Card.Text>
              <Card.Text>{`Played on: ${game.platform}`}</Card.Text>
              <Card.Title>{`Rating: ${game.rating}/10`}</Card.Title>
              <Button
                className="btn"
                variant="info"
                onClick={() => {
                  setSelectedGame(game);
                }}
              >
                Modify
              </Button>
              <Button
                variant="danger"
                onClick={() => handleGameDelete(user.id, game.id)}
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      {selectedGame && (
        <GameUpdateModal
          onUpdate={handleGameUpdate}
          onUpdateSuccess={() => setSelectedGame(null)}
          gameData={selectedGame}
        />
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default Home;
