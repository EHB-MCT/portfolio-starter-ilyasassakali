import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand className="logo">S&RGames</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to={"/"}
              className={location.pathname === "/" ? "active" : ""}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to={"/profile"}
              className={location.pathname === "/profile" ? "active" : ""}
            >
              Profile
            </Nav.Link>
          </Nav>
          {user && (
            <span className="welcome-message">Welcome, {user.username}!</span>
          )}
          <Button variant="outline-info" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
