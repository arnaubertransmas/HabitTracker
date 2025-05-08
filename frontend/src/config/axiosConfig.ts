import axios from 'axios';
import Cookies from 'js-cookie';

// API URL to Flask
const apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Ensure cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshAccessToken = async () => {
  try {
    // get refreshToken from cookes
    const refreshToken = Cookies.get('cookie_access_token_refresh');

    // put it in header
    const response = await axios.post(
      `${apiUrl}/auth/refresh_token`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    if (response.data.success && response.data.access_token) {
      Cookies.set('cookie_access_token', response.data.access_token, {
        expires: 7,
        path: '/',
      });
      return response.data.access_token;
    }
    return null;
  } catch (error) {
    // console.error('Error refreshing token:', error);
    return null;
  }
};

// Intercept requests to check for token expiration
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('cookie_access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Intercept responses to check if the token has expired
axiosInstance.interceptors.response.use(
  // if no error -->
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 = token expiration
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // avoid infinite loop
      originalRequest._retry = true;

      // request to refresh access token
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        // retry the original request w new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      }

      // if everything fails, force logout
      Cookies.remove('cookie_access_token');
      Cookies.remove('cookie_access_token_refresh');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_streak');
      localStorage.removeItem('cookies_consent_shown');
      // redirect to sign-in page
      window.location.href = '/signin';
    }

    // if other errors occur, reject the promise
    return Promise.reject(error);
  },
);

export default axiosInstance;
