import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "../profile/Profile.css";
import Alert from "react-bootstrap/Alert";
// eslint-disable-next-line
import * as THREE from "three";
import UserIcon from "../userIcon/UserIcon";

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    } else {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [navigate]);

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDelete = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const response = await fetch(`http://localhost/users/${user.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setSuccessMessage("Account deleted successfully");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      const response = await fetch(`http://localhost/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || undefined,
          email: email || undefined,
          password: password || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setErrorMessage("");
        setSuccessMessage("Profile updated successfully");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        sessionStorage.setItem("user", JSON.stringify(data));
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Internal Server Error");
    }
  };

  return (
    <div className="profile">
      <UserIcon />
      <Navbar />
      <h2>Profile</h2>

      <Form className="innerProfile" onSubmit={handleUpdateProfile}>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label className="label">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="label">Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="label">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
          <Form.Label className="label">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Profile
        </Button>
        {errorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}

        {!showDeleteConfirmation && (
          <Button
            variant="danger"
            onClick={handleDeleteConfirmation}
            style={{ marginTop: "10px" }}
          >
            Delete Profile
          </Button>
        )}
        {showDeleteConfirmation && (
          <div>
            <Alert variant="danger" style={{ marginTop: "20px" }}>
              DANGER ZONE:
              <br />
              Are you sure you want to delete your account? All saved games will
              be lost!
            </Alert>

            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              style={{ marginRight: "10px" }}
            >
              Confirm Deletion
            </Button>
            <Button variant="secondary" onClick={handleCancelDelete}>
              Cancel
            </Button>
          </div>
        )}
      </Form>

      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default Profile;
