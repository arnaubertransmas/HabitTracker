import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/ui/Header';

const Error404 = (): JSX.Element => {
  return (
    <>
      <Header />
      <Container fluid className="py-5 my-5">
        <Row className="justify-content-center text-center">
          <Col md={10} lg={8} xl={6}>
            <h1 className="display-1 fw-bold text-danger mb-0">404</h1>
            <div
              className="border-bottom border-danger mx-auto my-4"
              style={{ width: '50px', borderWidth: '3px' }}
            ></div>
            <h2 className="display-6 mb-3">Page not found</h2>
            <p className="lead text-muted mb-4">
              The page that you are looking for was not found or it has been
              moved to another location.
            </p>
            <Link to="/" className="btn btn-outline-secondary btn-lg">
              Go to home page
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Error404;
