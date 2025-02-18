import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';

const Login = () => {
  const methods = useForm();
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <Header />
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Row className="w-100">
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <Card className="shadow p-5" style={{ margin: 'auto' }}>
              <Card.Body>
                <h2 className="text-center mb-5">Sign In</h2>
                <FormProvider {...methods}>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter email"
                      className="form-control"
                    />
                    {errors.email && (
                      <p className="text-danger">{errors.email.message}</p>
                    )}
                    <Input
                      type="password"
                      id="password"
                      placeholder="Password"
                      className="form-control"
                    />
                    {errors.password && (
                      <p className="text-danger">{errors.password.message}</p>
                    )}
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      size="lg"
                    >
                      Submit
                    </Button>
                    <Form.Group className="text-center mt-3">
                      Don't have an account?
                      <Link to="/signup" className="ms-1">
                        Sign Up
                      </Link>
                    </Form.Group>
                  </Form>
                </FormProvider>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Login;
