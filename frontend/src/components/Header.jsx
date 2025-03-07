import { useEffect, useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

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
          // get cookie w access_token
          const accessToken = Cookies.get('cookie_access_token');
          if (accessToken) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // force logout if check_session fails
        Cookies.remove('cookie_access_token');
        setIsAuthenticated(false);
        console.error('Error checking session:', error);
      }
    };

    if (apiUrl) checkSession();

    // call it again if url change -->
  }, [apiUrl]);

  const handleLogout = async () => {
    try {
      const accessToken = Cookies.get('cookie_access_token');

      const response = await axios.post(
        `${apiUrl}/auth/logout`,
        {},
        {
          // access token in header for logout
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        // remove cookie
        Cookies.remove('cookie_access_token');
        localStorage.removeItem('user_name');
        setIsAuthenticated(false);
        redirect('/signin');
      }
    } catch (error) {
      console.error('Logout error:', error);

      // remove it anyway
      Cookies.remove('cookie_access_token');
      localStorage.removeItem('user_name');
      setIsAuthenticated(false);
      redirect('/signin');
    }
  };

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
