import { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const redirect = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${apiUrl}/auth/check_session`, {
          withCredentials: true,
        });

        if (response.data.success) {
          // If session check is successful, ensure token exists
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            setIsAuthenticated(true);
          } else {
            // If no token but session check succeeds, force logout
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // If session check fails, ensure we're logged out
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        console.error('Error checking session:', error);
      }
    };

    if (apiUrl) checkSession();
  }, [apiUrl]);

  const handleLogout = async () => {
    try {
      // Try to logout even if token is not in localStorage
      const accessToken = localStorage.getItem('access_token');

      const response = await axios.post(
        `${apiUrl}/auth/logout`,
        {},
        {
          headers: {
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        redirect('/signin');
      }
    } catch (error) {
      console.error('Logout error:', error);

      // Force logout even if there's an error
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      redirect('/signin');
    }
  };

  const loginStyle = {
    backgroundColor: '#f8f9fa',
    transition: '0.3s',
  };

  const registerStyle = {
    backgroundColor: '#2962FF',
    transition: '0.3s',
    color: 'white',
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
          <Nav.Link as={Link} to="/about-us">
            About us
          </Nav.Link>
          {isAuthenticated ? (
            <>
              <Nav.Link
                as={Link}
                to="/user"
                className="px-4 py-2 rounded"
                style={loginStyle}
                onMouseEnter={(e) => (e.target.style.color = '#007bff')}
                onMouseLeave={(e) => (e.target.style.color = 'black')}
              >
                User
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="#"
                className="fw-semibold px-4 py-2 rounded ms-2"
                style={registerStyle}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#0039CB')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = '#2962FF')
                }
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
