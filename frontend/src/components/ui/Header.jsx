import { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logout from '../../utils/logout';
import checkAuth from '../../utils/check_auth';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const redirect = useNavigate();

  useEffect(() => {
    checkAuth(setIsAuthenticated);
  }, []);

  // styles for buttons
  const loginStyle = {
    backgroundColor: '#f8f9fa',
    transition: '0.3s',
  };

  const registerStyle = {
    backgroundColor: '#2962FF',
    transition: '0.3s',
    color: 'white',
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
          {/* if true don't show signin&signup */}
          {isAuthenticated ? (
            <>
              <Nav.Link
                as={Link}
                to="/user"
                className="px-4 py-2 rounded"
                style={loginStyle}
                // + hover styles
                onMouseEnter={(e) => (e.target.style.color = '#007bff')}
                onMouseLeave={(e) => (e.target.style.color = 'black')}
              >
                {localStorage.getItem('user_name') || 'User'}
              </Nav.Link>
              <Nav.Link
                as={Link}
                className="fw-semibold px-4 py-2 rounded ms-2"
                style={registerStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#0039CB')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#2962FF')
                }
                // => for avoiding auto render
                onClick={handleLogout}
              >
                Logout
              </Nav.Link>
            </>
          ) : (
            // otherwise -->
            <>
              <Nav.Link
                as={Link}
                to="/signin"
                className="px-4 py-2 rounded"
                style={loginStyle}
                onMouseEnter={(e) => (e.target.style.color = '#007bff')}
                onMouseLeave={(e) => (e.target.style.color = 'black')}
              >
                Sign In
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/signup"
                className="fw-semibold px-4 py-2 rounded ms-2"
                style={registerStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#0039CB')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#2962FF')
                }
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
