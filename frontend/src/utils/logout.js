import Cookies from 'js-cookie';
import axios from 'axios';

const logout = async (apiUrl, redirect, setIsAuthenticated) => {
  try {
    const accessToken = Cookies.get('cookie_access_token');
    const response = await axios.post(
      `${apiUrl}/auth/logout`,
      {},
      {
        // access token in header for logout
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    );

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
