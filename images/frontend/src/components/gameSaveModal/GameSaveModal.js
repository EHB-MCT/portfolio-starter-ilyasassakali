import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "../gameSaveModal/GameSaveModal.css";

function GameSaveModal({ onSave, onSaveSuccess }) {
  const [show, setShow] = useState(false);
  const [gameName, setGameName] = useState("");
  const [gameImage, setGameImage] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [gamePlatform, setGamePlatform] = useState("");
  const [gameRating, setGameRating] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setShow(false);
    setErrorMessage("");
  };

  const handleShow = () => setShow(true);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleSave = async () => {
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
      const response = await fetch(`http://localhost/games/${user.id}`, {
        method: "POST",
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
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data);

        onSaveSuccess();
        handleClose();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  return (
    <>
      <Button className="savebtn" variant="primary" onClick={handleShow}>
        Save Game
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Save Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="gameName">
              <Form.Label>Game Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter game name"
                onChange={(e) => setGameName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="gameImage">
              <Form.Label>Game Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter game image URL"
                onChange={(e) => setGameImage(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="gameDescription">
              <Form.Label>Game Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter game description"
                onChange={(e) => setGameDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="gamePlatform">
              <Form.Label>Game Platform</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter game platform"
                onChange={(e) => setGamePlatform(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="gameRating">
              <Form.Label>Game Rating</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter game rating"
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
          <Button variant="primary" onClick={handleSave}>
            Save Game
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GameSaveModal;
