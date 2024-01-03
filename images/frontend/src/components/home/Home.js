import React, { useEffect, useState } from "react";
import "../home/Home.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";

function Home() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost/games/1");
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

      <div className="card-container">
        <Card
          bg="dark"
          data-bs-theme="dark"
          style={{ width: "20rem" }}
          className="add-game-card"
        >
          <Card.Body>
            <Card.Text className="add-game-icon">+</Card.Text>
            <Card.Title>Save Game</Card.Title>
          </Card.Body>
        </Card>

        {games.map((game) => (
          <Card
            key={game.id}
            bg="dark"
            data-bs-theme="dark"
            style={{ width: "25rem" }}
          >
            <Card.Img src={game.image} />
            <Card.Body>
              <Card.Title>{game.name}</Card.Title>
              <Card.Text>{game.description}</Card.Text>
              <Card.Title>{game.platform}</Card.Title>
              <Card.Title>{`Rating: ${game.rating}/10`}</Card.Title>
              <Button className="btn" variant="warning">
                Modify
              </Button>
              <Button variant="danger">Delete</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;
