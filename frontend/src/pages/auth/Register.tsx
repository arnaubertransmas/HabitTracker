import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
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
import Header from '../../components/ui/Header';
import Input from '../../components/ui/Input';
import UserInterface from '../../types/auth';
import CreateUserLogic from '../../hooks/createUserLogic';

interface UserFormProps {
  userToUpdate?: UserInterface | null;
}

// register main page
const Register: React.FC<UserFormProps> = ({ userToUpdate }) => {
  const {
    methods,
    handleSubmit,
    errors,
    password,
    onSubmit,
    handleDelete,
    error,
    success,
    loading,
    isEditMode,
  } = CreateUserLogic({ userToUpdate });

  const redirect = useNavigate();
  const userName = localStorage.getItem('user_name');

  useEffect(() => {
    if (userName) redirect(`/user/${userName}`);
  }, [userName, redirect]);

  return (
    <>
      <Header />
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Row className="w-100">
          <Col xs={12} md={8} lg={6} className="mx-auto">
            <Card className="shadow p-5" style={{ margin: 'auto' }}>
              <Card.Body>
                {/* if isEditMode show EditProfile */}
                <h2 className="text-center mb-5">
                  {isEditMode ? 'Edit Profile' : 'Sign Up'}
                </h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

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
                      disabled={isEditMode} // Disable email field in editMode
                    />
                    {errors.email && (
                      <p className="text-danger">{errors.email.message}</p>
                    )}

                    <Input
                      type="password"
                      id="password"
                      placeholder={
                        isEditMode
                          ? 'New password (leave blank to keep current)'
                          : 'Password'
                      }
                      className="form-control"
                      rules={{
                        required: !isEditMode ? 'Password is required' : false,
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
                      placeholder={
                        isEditMode
                          ? 'Confirm new password'
                          : 'Repeat your password'
                      }
                      className="form-control"
                      rules={{
                        required: !isEditMode
                          ? 'Please confirm your password'
                          : false,
                        validate: (value: string) =>
                          !value ||
                          !password ||
                          value === password ||
                          'Passwords do not match',
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
                      {loading
                        ? isEditMode
                          ? 'Updating...'
                          : 'Registering...'
                        : isEditMode
                          ? 'Update Profile'
                          : 'Sign Up'}
                    </Button>

                    {!isEditMode ? (
                      <Form.Group className="text-center mt-3">
                        Already have an account?
                        <Link to="/signin" className="ms-1">
                          Sign in
                        </Link>
                      </Form.Group>
                    ) : (
                      <Form.Group className="text-center mt-3 border border-danger p-2 rounded">
                        <Link
                          to="/"
                          style={{ cursor: 'pointer', textDecoration: 'none' }}
                          onClick={handleDelete}
                          className="ms-1 text-black"
                        >
                          Delete Account
                        </Link>
                      </Form.Group>
                    )}
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
