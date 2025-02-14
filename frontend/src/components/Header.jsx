import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  const loginStyle = {
    backgroundColor: '#f8f9fa',
    transition: '0.3s',
  };
  const registerStyle = {
    backgroundColor: '#2962FF',
    transition: '0.3s',
  };

  return (
    <Navbar
      bg="light"
      data-bs-theme="light"
      sticky="top"
      className="border shadow-sm py-3"
    >
      <Container>
        <Navbar.Brand className="fw-bold text-primary">
          <Link to="/" style={{ textDecoration: 'none' }}>
            Habit Tracker
          </Link>
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/about-us">
            About us
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/signin"
            className="px-4 py-2 rounded"
            style={loginStyle}
            // hover de react-bootstrap
            onMouseEnter={(e) => (e.target.style.color = '#007bff')}
            onMouseLeave={(e) => (e.target.style.color = 'black')}
          >
            Sign In
          </Nav.Link>

          <Nav.Link
            as={Link}
            to="/signup"
            className="fw-semibold text-white px-4 py-2 rounded ms-2"
            style={registerStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#0039CB')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#2962FF')}
          >
            Sign Up
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
