import axios from 'axios';

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling
    console.error('Axios Error:', error);

    // Check for specific error types
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
