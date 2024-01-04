import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "../gameSaveModal/GameSaveModal.css";

function GameUpdateModal({ onUpdate, onUpdateSuccess, gameData }) {
  const [show, setShow] = useState(true);
  const [gameName, setGameName] = useState(gameData.name);
  const [gameImage, setGameImage] = useState(gameData.image);
  const [gameDescription, setGameDescription] = useState(gameData.description);
  const [gamePlatform, setGamePlatform] = useState(gameData.platform);
  const [gameRating, setGameRating] = useState(String(gameData.rating));
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setGameName(gameData.name);
    setGameImage(gameData.image);
    setGameDescription(gameData.description);
    setGamePlatform(gameData.platform);
    setGameRating(String(gameData.rating));
  }, [gameData]);

  const handleClose = () => {
    setShow(false);
    setErrorMessage("");
    onUpdateSuccess();
  };

  const handleUpdate = async () => {
    if (isNaN(gameRating) || gameRating.includes(".")) {
      setErrorMessage("Please enter a valid whole number for Game Rating.");
      return;
    }

    const parsedRating = parseFloat(gameRating);

    if (parsedRating < 0 || parsedRating > 10) {
      setErrorMessage("Game Rating should be between 0 and 10.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost/games/${gameData.user_id}/${gameData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: gameName,
            image: gameImage,
            description: gameDescription,
            platform: gamePlatform,
            rating: parsedRating,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onUpdate(data);
        handleClose();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modify Game</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="gameName">
            <Form.Label>Game Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter game name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="gameImage">
            <Form.Label>Game Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter game image URL"
              value={gameImage}
              onChange={(e) => setGameImage(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="gameDescription">
            <Form.Label>Game Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter game description"
              value={gameDescription}
              onChange={(e) => setGameDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="gamePlatform">
            <Form.Label>Game Platform</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter game platform"
              value={gamePlatform}
              onChange={(e) => setGamePlatform(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="gameRating">
            <Form.Label>Game Rating</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter game rating"
              value={gameRating}
              onChange={(e) => setGameRating(e.target.value)}
            />
          </Form.Group>
        </Form>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="info" onClick={handleUpdate}>
          Modify
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GameUpdateModal;
