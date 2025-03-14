import axios from 'axios';
import Cookies from 'js-cookie';

// api Url to Flask.py
const apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// if there's token put it to request
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

export default axiosInstance;
