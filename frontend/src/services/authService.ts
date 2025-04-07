import axiosInstance from '../config/axiosConfig';
import Cookies from 'js-cookie';
import UserInterface from '../types/auth';

export const login = async (
  email: string,
  password: string,
  redirect: (path: string) => void,
  setError?: (error: string) => void,
) => {
  try {
    // clear any previous errors
    if (setError) setError('');

    const response = await axiosInstance.post('/auth/signin', {
      email,
      password,
    });

    const result = response.data;
    if (!result.success) {
      if (setError) setError('Invalid Credentials');
      return false;
    }

    if (result.access_token && result.user) {
      // set cookie with access token
      Cookies.set('cookie_access_token', result.access_token, {
        expires: 7,
        path: '/',
      });

      // save user name to localStorage
      localStorage.setItem('user_name', result.user.name);
      localStorage.setItem('email', email);

      // redirect to user's profile page
      redirect(`/user/${result.user.name.toLowerCase()}`);
      return true;
    }

    return false;
  } catch (err: any) {
    console.error('Login error:', err.response?.data);
    if (setError) setError('Invalid Credentials');
    return false;
  }
};

export const register = async (
  data: UserInterface,
  redirect: (path: string) => void,
  setError: (error: string) => void,
) => {
  try {
    // validate password (again)
    if (data.password !== data.password2) {
      setError('Passwords do not match');
      return false;
    }

    setError('');

    const response = await axiosInstance.post('/auth/signup', {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
      password2: data.password2,
    });

    const result = response.data;
    if (!result.success) {
      setError(result.message || 'Registration failed');
      return false;
    }

    // Redirect to signin page after successful registration
    redirect('/signin');
    return true;
  } catch (err: any) {
    console.error('Registration error:', err.response?.data);
    setError('Internal server error, try again later...');
    return false;
  }
};

export const getUser = async (email: string) => {
  try {
    const response = await axiosInstance.get(`/auth/get_user/${email}`);

    if (response.data.success) {
      return response.data.user;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const checkAuth = async (
  setIsAuthenticated: (value: boolean) => void,
) => {
  try {
    const response = await axiosInstance.get('/auth/check_session');

    if (response.data.success && Cookies.get('cookie_access_token')) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  } catch (error) {
    Cookies.remove('cookie_access_token');
    setIsAuthenticated(false);
    console.error('Error checking session:', error);
  }
};

export const logout = async (
  redirect: (path: string) => void,
  setIsAuthenticated: (value: boolean) => void,
) => {
  try {
    const response = await axiosInstance.post('/auth/logout');

    if (response.data.success) {
      // remove cookie
      Cookies.remove('cookie_access_token');
      localStorage.removeItem('user_name');
      localStorage.removeItem('email');
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
