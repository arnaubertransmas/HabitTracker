import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/ui/Header';
import Sidebar from '../components/ui/Sidebar';
import { checkAuth } from '../services/authService';

// error page, 404
const Error404 = (): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // check if authenticated
    checkAuth(setIsAuthenticated);
  }, []);

  return (
    <>
      <Header />
      <Container fluid>
        <Row>
          {/* if true show sidebar */}
          {isAuthenticated && (
            <Col md={3} lg={2} className="d-md-block bg-light sidebar">
              <Sidebar />
            </Col>
          )}

          <Col md={isAuthenticated ? 9 : 12} lg={isAuthenticated ? 10 : 12}>
            <Container fluid className="py-5 my-5">
              <Row className="justify-content-center text-center">
                <Col md={10} lg={8} xl={6}>
                  <h1 className="display-1 fw-bold text-danger mb-0">404</h1>
                  <Row className="justify-content-center">
                    <Col xs="auto">
                      <div
                        className="border-bottom border-danger my-4"
                        style={{ width: '50px', borderWidth: '3px' }}
                      ></div>
                    </Col>
                  </Row>
                  <h2 className="display-6 mb-3">Page not found</h2>
                  <p className="lead text-muted mb-4">
                    The page that you are looking for was not found or it has
                    been moved to another location.
                  </p>
                  <Link to="/" className="btn btn-outline-secondary btn-lg">
                    Go to home page
                  </Link>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Error404;
