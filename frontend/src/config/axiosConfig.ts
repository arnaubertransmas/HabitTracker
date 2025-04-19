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
    // Get the refresh token with the correct name
    const refreshToken = Cookies.get('cookie_access_token_refresh');

    // Send the refresh token in the Authorization header
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
    console.error('Error refreshing token:', error);
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
  (response) => response, // If no error, simply return the response
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to token expiration (401 Unauthorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Avoid infinite loop

      // Try to refresh the access token
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        // Retry the original request with the new access token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest); // Retry the original request
      }

      // If the refresh token also fails, log the user out
      Cookies.remove('cookie_access_token');
      Cookies.remove('refresh_token');
      localStorage.removeItem('user_name');
      window.location.href = '/signin'; // Redirect to login
    }

    // If other errors occur, reject the promise
    return Promise.reject(error);
  },
);

export default axiosInstance;
