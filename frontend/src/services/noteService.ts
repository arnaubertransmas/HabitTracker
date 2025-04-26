import axiosInstance from '../config/axiosConfig';

export const saveNote = async (habitName: string, note: string) => {
  try {
    // send note to backend
    const response = await axiosInstance.post('/notes/save_note', {
      note: note,
      habit_name: habitName,
    });

    return response.data.success;
  } catch (err) {
    // console.error('Error saving note:', err);
    return false;
  }
};

export const getNote = async (habit_name: string) => {
  try {
    const response = await axiosInstance.get(`/notes/get_note/${habit_name}`);

    if (!response.data.success) {
      // empty note if err
      return { note: {} };
    }

    return response.data;
  } catch (err: any) {
    if (err.response && err.response.status === 404) {
      return { note: {} };
    }
    // console.error('Error getting note:', err);
    return null;
  }
};
