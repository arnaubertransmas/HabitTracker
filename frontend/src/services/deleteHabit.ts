import axiosInstance from '../config/axiosConfig';

const handleDelete = async (name: string, loadHabits: () => void) => {
  try {
    const response = await axiosInstance.delete(`/habit/delete_habit/${name}`);

    const result = response.data;

    if (!response.data.success) {
      console.error('Error from server:', result);
    } else {
      loadHabits();
    }
  } catch (error) {
    console.log('Error deleting' + error);
  }
};

export default handleDelete;
