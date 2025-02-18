import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Input from '../components/Input';

const Register = () => {
  const methods = useForm({ mode: 'onChange' });
  // abans de cridar onsubmit validem el form
  // agafem les propietats de useformContext:
  const {
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const onSubmit = (data) => {
    if (data.password !== data.password2) {
      return;
    }
    console.log(data);
  };

  const password = watch('password');

  return (
    <>
      <Header />
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Row className="w-100">
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <Card className="shadow p-5" style={{ margin: 'auto' }}>
              <Card.Body>
                <h2 className="text-center mb-5">Sign Up</h2>
                {/* li passem el useFormContext per accedir al form */}
                <FormProvider {...methods}>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Name"
                      className="form-control"
                    />
                    {errors.name && (
                      <p className="text-danger">{errors.name.message}</p>
                    )}
                    <Input
                      type="text"
                      id="surname"
                      placeholder="Second name"
                      className="form-control"
                    />
                    {errors.surname && (
                      <p className="text-danger">{errors.surname.message}</p>
                    )}
                    <Input
                      type="email"
                      id="email"
                      placeholder="Email address"
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
                      rules={{
                        required: 'Please confirm your password',
                        validate: {
                          matchPassword: (value) => {
                            return value === password || 'Passwords must match';
                          },
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
                      validate={{
                        // Validar que la contrasenya repetida sigui igual a la contrasenya
                        validate: (value) =>
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
