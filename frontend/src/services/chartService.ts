import axiosInstance from '../config/axiosConfig';

// get user data form the backend server
export const getUserData = async () => {
  try {
    const response = await axiosInstance.get('progress/get_user_data');

    if (!response.data.success) {
      return response.data.message;
    }
    return response.data.user_data;
  } catch (err) {
    // console.error('Err fetching user data details' + err);
    return null;
  }
};
