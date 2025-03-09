import axios from 'axios';
import Cookies from 'js-cookie';

const checkAuth = async (apiUrl, setIsAuthenticated) => {
  try {
    const response = await axios.get(`${apiUrl}/auth/check_session`, {
      withCredentials: true,
    });

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

// ! CONTIONUAR AQUI, NO ES GUARDA LA COOKIE CORRECTAMETN AMB LA NOVA STRUCTURE, REVISAR-HO
