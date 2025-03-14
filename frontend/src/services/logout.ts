import Cookies from 'js-cookie';
import axiosInstance from '../config/axiosConfig';

const logout = async (
  redirect: (path: string) => void,
  setIsAuthenticated: (value: boolean) => void,
) => {
  try {
    const response = await axiosInstance.post('/auth/logout');

    if (response.data.success) {
      // remove cookie
      Cookies.remove('cookie_access_token');
      localStorage.removeItem('user_name');
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

export default logout;
