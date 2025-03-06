import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
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
import axios from 'axios';
import Header from '../components/Header';
import Input from '../components/Input';
import Cookies from 'js-cookie';

const Login = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const redirect = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const methods = useForm({ mode: 'onChange' });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);

      const response = await axios.post(
        `${apiUrl}/auth/signin`,
        {
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      const result = response.data;

      if (!result.Success) {
        setError(result.message || 'Invalid Credentials');
        return;
      }

      if (result.access_token) {
        // set a cookie with access token
        Cookies.set('cookie_access_token', result.access_token, {
          // 1 week expiration
          expires: 7,
          path: '/',
        });
        redirect('/');
      }
    } catch (err) {
      console.log(err);
      setError('Invalid Credentials');
    } finally {
      setLoading(false);
    }
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
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                {/* methods const inject for reactivness */}
                <FormProvider {...methods}>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter email"
                      className="form-control"
                      rules={{ required: 'Email is required' }}
                    />
                    {errors.email && (
                      <p className="text-danger">{errors.email.message}</p>
                    )}
                    <Input
                      type="password"
                      id="password"
                      placeholder="Password"
                      className="form-control"
                      rules={{ required: 'Password is required' }}
                    />
                    {errors.password && (
                      <p className="text-danger">{errors.password.message}</p>
                    )}
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Sign in'}
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
