import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { checkAuth } from '../../services/authService';
import '../../assets/css/header.css';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const redirect = useNavigate();

  useEffect(() => {
    checkAuth(setIsAuthenticated);
  }, []);

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
          {/* if isAuthentiacted --> */}
          {isAuthenticated ? (
            <>
              <Nav>
                {/* dropdown menu for user_name */}
                <Dropdown>
                  <Dropdown.Toggle
                    as={Nav.Link}
                    className="px-4 py-2 rounded login-style"
                  >
                    {localStorage.getItem('user_name') || 'User'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      to={`/user/${localStorage.getItem('user_name')}/edit_profile`}
                      className="px-4 py-2 rounded login-style nav-link-signin"
                    >
                      Edit Profile
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
              <Nav.Link
                as={Link}
                to="#"
                className="fw-semibold px-4 py-2 rounded ms-2 register-style"
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
                className="px-4 py-2 rounded login-style nav-link-signin"
              >
                Sign In
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/signup"
                className="fw-semibold px-4 py-2 rounded ms-2 register-style"
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
