import Cookies from 'js-cookie';
import axiosInstance from '../config/axiosConfig';

const checkAuth = async (setIsAuthenticated: (value: boolean) => void) => {
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

export default checkAuth;
