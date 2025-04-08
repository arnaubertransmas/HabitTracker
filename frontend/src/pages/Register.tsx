import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Input from '../components/ui/Input';
import UserInterface from '../types/auth';
import { register } from '../services/authService';

const Register = () => {
  const [error, setError] = useState<string>(''); // Set initial error state as an empty string
  const [loading, setLoading] = useState<boolean>(false);
  const redirect = useNavigate();

  const methods = useForm<UserInterface>({ mode: 'onChange' });
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const password = watch('password'); // Real-time watch for password

  // onSubmit func w UserInterface type
  const onSubmit: SubmitHandler<UserInterface> = async (data) => {
    if (data.password !== data.password2) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(data, redirect, setError);
    } finally {
      setLoading(false);
    }
  };

  return (
    // return register dynamic form
    <>
      <Header />
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Row className="w-100">
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <Card className="shadow p-5" style={{ margin: 'auto' }}>
              <Card.Body>
                <h2 className="text-center mb-5">Sign Up</h2>
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                {/* Inject methods validations to form */}
                <FormProvider {...methods}>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Name"
                      className="form-control"
                      rules={{
                        required: 'Name is required',
                        pattern: {
                          value: /^[A-Za-z\s]+$/i,
                          message: 'Include only letters',
                        },
                      }}
                    />
                    {errors.name && (
                      <p className="text-danger">{errors.name.message}</p>
                    )}

                    <Input
                      type="text"
                      id="surname"
                      placeholder="Second name"
                      className="form-control"
                      rules={{
                        required: 'Second name is required',
                        pattern: {
                          value: /^[A-Za-z\s]+$/i,
                          message: 'Include only letters',
                        },
                      }}
                    />
                    {errors.surname && (
                      <p className="text-danger">{errors.surname.message}</p>
                    )}

                    <Input
                      type="email"
                      id="email"
                      placeholder="Email address"
                      className="form-control"
                      rules={{
                        required: 'Email address is required',
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                          message: 'Invalid email address',
                        },
                      }}
                    />
                    {errors.email && (
                      <p className="text-danger">{errors.email.message}</p>
                    )}

                    <Input
                      type="password"
                      id="password"
                      placeholder="Password"
                      className="form-control"
                      rules={{
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                        pattern: {
                          value:
                            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{8,}$/i,
                          message:
                            'Include uppercase, numbers and special characters',
                        },
                      }}
                    />
                    {errors.password && (
                      <p className="text-danger">{errors.password.message}</p>
                    )}

                    <Input
                      type="password"
                      id="password2"
                      placeholder="Repeat your password"
                      className="form-control"
                      rules={{
                        required: 'Please confirm your password',
                        validate: (value: string) =>
                          value === password || 'Passwords do not match',
                      }}
                    />

                    {errors.password2 && (
                      <p className="text-danger">{errors.password2.message}</p>
                    )}

                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Registering...' : 'Sign up'}
                    </Button>

                    <Form.Group className="text-center mt-3">
                      Already have an account?
                      <Link to="/signin" className="ms-1">
                        Sign in
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

export default Register;
