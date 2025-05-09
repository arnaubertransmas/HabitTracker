import axiosInstance from '../config/axiosConfig';
import HabitInterface from '../types/habit';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// get all habits with optional filtering by habit type
export const getHabits = async (habitType?: 'Habit' | 'Non-negotiable') => {
  try {
    // if type specified filter by it
    const url = habitType
      ? `/habit/get_habits?type=${habitType}`
      : '/habit/get_habits';
    const response = await axiosInstance.get(url);

    if (!response.data.success) {
      // console.error('Could not load habits:', response.data.message);
      return null;
    }
    return response?.data?.habits || [];
  } catch (err) {
    // console.error('Error fetching habit details:', err);
    return null;
  }
};

// retrieves a single habit based on its name
export const getHabit = async (habitName: string) => {
  try {
    const response = await axiosInstance.get(
      `/habit/habit_detail/${habitName}`,
    );

    if (!response.data.success) {
      // console.error('Habit operation failed:', response.data.message);
      return null;
    }
    return response.data.habit;
  } catch (err) {
    // console.error('Error fetching habit details:', err);
    return null;
  }
};

// creates a new habit
export const createHabits = async (
  data: HabitInterface,
  loadHabits?: () => Promise<void>,
) => {
  try {
    // data = dict
    const response = await axiosInstance.post('/habit/create_habit', data);
    const responseData = response.data;

    if (!responseData || responseData.success !== true) {
      // console.error(
      //   'Habit operation failed',
      //   responseData?.message || 'Unknown error',
      // );
      return {
        success: false,
        message: responseData?.message || 'Failed to create habit',
      };
    }

    if (loadHabits) {
      await loadHabits();
    }

    toast.success('Successfully created');
    return { success: true, message: 'Habit created successfully' };
  } catch (err: unknown) {
    // console.error('Error processing habit:', err);

    // check if err is an Axios error
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as {
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };

      return {
        // show message from backend
        success: false,
        message:
          axiosError.response?.data?.message ||
          `Server error: ${axiosError.response?.status}`,
      };
    }

    return {
      // show err code status if everything fails
      success: false,
      message:
        err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
};

// updates an existing habit using its name as the identifier
export const editHabit = async (
  habitToEdit: HabitInterface,
  habit: HabitInterface,
  loadHabits?: () => Promise<void>,
) => {
  try {
    // pass whole habit to update
    const response = await axiosInstance.put(
      `/habit/update_habit/${habitToEdit.name}`,
      habit,
    );
    const responseData = response.data;

    if (!responseData || responseData.success !== true) {
      // console.error(
      //   'Habit operation failed',
      //   responseData?.message || 'Unknown error',
      // );
      return {
        success: false,
        message: responseData?.message || 'Failed to update habit',
      };
    }

    if (loadHabits) {
      await loadHabits();
    }

    toast.success(`${habitToEdit.name} edited successfully`);
    return { success: true, message: 'Habit updated successfully' };
  } catch (err: unknown) {
    // console.error('Error updating habit:', err);

    // check if its axios err
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as {
        response?: {
          data?: { message?: string };
          status?: number;
        };
      };

      return {
        // return message data from api if there's
        success: false,
        message:
          axiosError.response?.data?.message ||
          `Server error: ${axiosError.response?.status}`,
      };
    }

    return {
      // if everything fails return status code err
      success: false,
      message: err instanceof Error ? err.message : 'Unknown server error',
    };
  }
};

// function to complete Habits
export const completeHabit = async (
  habitName: string,
  selectedDate: string,
  loadHabits?: () => Promise<void>,
) => {
  try {
    // send date as string in YYYY-MM-DD
    const date = selectedDate.split('T')[0];
    const response = await axiosInstance.post(`/habit/complete/${habitName}`, {
      completed: date,
    });

    if (!response.data || !response.data.success) {
      // console.error('Habit completion failed', response.data?.message);
      return false;
    }

    toast.success(`${habitName} completed for today!`);
    if (loadHabits) {
      loadHabits();
    }
    return true;
  } catch (err) {
    // console.error('Error completing habit:', err);
    return false;
  }
};

// deletes a habit by name
export const deleteHabit = async (name: string, loadHabits: () => void) => {
  try {
    const response = await axiosInstance.delete(`/habit/delete_habit/${name}`);
    // const result = response.data;
    if (!response.data.success) {
      // console.error('Error from server:', result);
      return false;
    } else {
      toast.error(`${name} deleted successfully`);
      await loadHabits();
      return true;
    }
  } catch (error) {
    // console.error('Error deleting: ', error);
    return false;
  }
};
