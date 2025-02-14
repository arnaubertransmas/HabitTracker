import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <>
      <Header />
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Row className="w-100">
          {/* num de grid col per small, medium and large devices */}
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <Card className="shadow p-5" style={{ margin: 'auto' }}>
              <Card.Body>
                <h2 className="text-center mb-5">Sign Up</h2>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Control type="text" placeholder="Name" size="lg" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicSurname">
                    <Form.Control
                      type="text"
                      placeholder="Second name"
                      size="lg"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email address"
                      size="lg"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      size="lg"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword2">
                    <Form.Control
                      type="password"
                      placeholder="Repeat your password"
                      size="lg"
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    size="lg"
                  >
                    Submit
                  </Button>
                  <Form.Group className="text-center mt-3">
                    Already have an account?
                    <Link to="/signin" className="ms-1">
                      Sign in
                    </Link>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Register;
