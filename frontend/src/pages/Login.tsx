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
import Cookies from 'js-cookie';
import axiosInstance from '../config/axiosConfig';
import Header from '../components/ui/Header';
import Input from '../components/ui/Input';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const redirect = useNavigate();
  const methods = useForm<FormData>({ mode: 'onChange' });
  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      setLoading(true);

      const response = await axiosInstance.post('/auth/signin', {
        email: data.email,
        password: data.password,
      });

      const result = response.data;
      if (!result.success) {
        setError('Invalid Credentials');
        return;
      }

      if (result.access_token && result.user) {
        // set a cookie with access token
        Cookies.set('cookie_access_token', result.access_token, {
          expires: 7,
          path: '/',
        });

        // setName to localstorage
        localStorage.setItem('user_name', result.user.name);
        redirect(`/user/${result.user.name.toLowerCase()}`);
      }
    } catch (err: any) {
      console.log('Error message:', err.response?.data);
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
                      <p className="text-danger">{errors.email?.message}</p>
                    )}
                    <Input
                      type="password"
                      id="password"
                      placeholder="Password"
                      className="form-control"
                      rules={{ required: 'Password is required' }}
                    />
                    {errors.password && (
                      <p className="text-danger">{errors.password?.message}</p>
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
