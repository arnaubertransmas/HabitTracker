import axiosInstance from '../config/axiosConfig';

export const getUserData = async () => {
  try {
    const response = await axiosInstance.get('progress/get_user_data');
    console.log(response.data.user_data);

    if (!response.data.success) {
      return response.data.message;
    }
    return response.data.user_data;
  } catch (err) {
    console.log('Err fetching user data details' + err);
    return null;
  }
};
