import { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { checkAuth } from '../../services/authService';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const redirect = useNavigate();

  useEffect(() => {
    checkAuth(setIsAuthenticated);
  }, []);

  const loginStyle = {
    backgroundColor: '#f8f9fa',
    transition: '0.3s',
  };

  const registerStyle = {
    backgroundColor: '#2962FF',
    transition: '0.3s',
    color: 'white',
  };

  const loginHoverStyle = {
    color: '#007bff',
  };

  const registerHoverStyle = {
    backgroundColor: '#0039CB',
  };

  const handleLogout = () => {
    logout(redirect, setIsAuthenticated);
  };

  return (
    <Navbar bg="light" sticky="top" className="border shadow-sm py-3">
      <Container>
        <Navbar.Brand className="fw-bold text-primary">
          <Link to="/" style={{ textDecoration: 'none' }}>
            Habit Tracker
          </Link>
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/about_us">
            About us
          </Nav.Link>
          {isAuthenticated ? (
            <>
              <Nav.Link
                as={Link}
                to={`/user/${localStorage.getItem('user_name')}`}
                className="px-4 py-2 rounded"
                style={loginStyle}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement; // Without that cannot declare style
                  target.style.color = loginHoverStyle.color;
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'black';
                }}
              >
                {localStorage.getItem('user_name') || 'User'}
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="#"
                className="fw-semibold px-4 py-2 rounded ms-2"
                style={registerStyle}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.backgroundColor =
                    registerHoverStyle.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.backgroundColor = '#2962FF';
                }}
                onClick={handleLogout}
              >
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/signin"
                className="px-4 py-2 rounded"
                style={loginStyle}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = '#007bff';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.color = 'black';
                }}
              >
                Sign In
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/signup"
                className="fw-semibold px-4 py-2 rounded ms-2"
                style={registerStyle}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.backgroundColor = '#0039CB';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLAnchorElement;
                  target.style.backgroundColor = '#2962FF';
                }}
              >
                Sign Up
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
