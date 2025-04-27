import axiosInstance from '../config/axiosConfig';
import Cookies from 'js-cookie';
import UserInterface from '../types/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// function to login user
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
      Cookies.set('cookie_access_token_refresh', result.access_token_refresh, {
        expires: 7,
        path: '/',
      });

      // save user name to localStorage
      localStorage.setItem('user_name', result.user.name);

      // redirect to user's profile page
      redirect(`/user/${result.user.name}`);
      toast.info('Logged');
      return true;
    }

    return false;
  } catch (err: any) {
    // console.error('Login error:', err.response?.data);
    if (setError) setError('Invalid Credentials');
    return false;
  }
};

// Register function
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

    // pass data to backend
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
    toast.info('User registered, sign in');
    return true;
  } catch (err: any) {
    // console.error('Registration error:', err.response.data);
    // set error directly from service
    setError(err.response.data);
    return false;
  }
};

// Fetch user data by email
export const getUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/get_user');
    if (response.data.success) {
      return response.data.user;
    }
  } catch (error) {
    // console.error('Error fetching user:', error);
    return null;
  }
};

// Update user data
export const updateUser = async (dataUpdate: UserInterface) => {
  try {
    const response = await axiosInstance.put('/auth/update_user', dataUpdate);

    if (response.data.success) {
      toast.warning('User updated');
      return true;
    } else {
      // console.error('Error from server:', response.data.message);
      return false;
    }
  } catch (err) {
    // console.error('Error updating user:', err);
    return false;
  }
};

export const updateStreak = async (
  date: string,
  loadHabits?: () => Promise<void>,
) => {
  try {
    const response = await axiosInstance.post('/auth/update_streak', {
      date: date,
    });

    const result = response.data;

    if (!result || !result.success) {
      // console.error('Error from server:', result?.message || 'Unknown error');
      return false;
    }

    if (loadHabits) {
      await loadHabits();
    }
    return true;
  } catch (err) {
    // console.error('Error updating streak:', err);
    return false;
  }
};

// DeleteUser function
export const deleteUser = async () => {
  try {
    const response = await axiosInstance.delete(`/auth/delete_user`);

    if (response.data.success) {
      toast.error('User removed');
      // remove cookies + localStorage
      Cookies.remove('cookie_access_token');
      Cookies.remove('cookie_access_token_refresh');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_streak');
      localStorage.removeItem('cookies_consent_shown');
      return true;
    } else {
      // console.error('Error from server:', response.data.message);
      return false;
    }
  } catch (err) {
    // console.error('Error deleting user:', err);
    return false;
  }
};

// Check if user is authenticated
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
    // console.error('Error checking session:', error);
  }
};

// Logout function
export const logout = async (
  redirect: (path: string) => void,
  setIsAuthenticated: (value: boolean) => void,
) => {
  try {
    const response = await axiosInstance.post('/auth/logout');

    if (response.data.success) {
      toast.info('Goodbye!');
      // remove cookies + localStorage
      Cookies.remove('cookie_access_token');
      Cookies.remove('cookie_access_token_refresh');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_streak');
      localStorage.removeItem('cookies_consent_shown');
      setIsAuthenticated(false);
      redirect('/signin');
    }
  } catch (error) {
    // console.error('Logout error:', error);

    // remove it anyway
    Cookies.remove('cookie_access_token');
    localStorage.removeItem('user_name');
    setIsAuthenticated(false);
    redirect('/signin');
  }
};
