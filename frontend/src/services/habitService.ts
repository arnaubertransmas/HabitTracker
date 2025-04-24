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
      console.error('Could not load habits:', response.data.message);
      return null;
    }
    return response?.data?.habits || [];
  } catch (err) {
    console.error('Error fetching habit details:', err);
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
      console.error('Habit operation failed:', response.data.message);
      return null;
    }
    return response.data.habit;
  } catch (err) {
    console.error('Error fetching habit details:', err);
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
    if (!response.data.success) {
      console.error('Habit operation failed', response.data.message);
      return false;
    }

    if (loadHabits) {
      await loadHabits();
    }
    toast.success('Successfully created');
    return true;
  } catch (err) {
    console.error('Error processing habit:', err);
    return false;
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
    if (!response.data || !response.data.success) {
      console.error(
        'Habit operation failed',
        response.data?.message || 'Unknown error',
      );
      return false;
    }
    // if loadHabits is provided, call it to refresh the data
    if (loadHabits) {
      await loadHabits();
    }
    toast.warning(`${habitToEdit.name} edited succesfully`);
    return true;
  } catch (err) {
    console.error('Error updating habit:', err);
    return false;
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
      console.error('Habit completion failed', response.data?.message);
      return false;
    }
    toast.success(`${habitName} completed for today!`);
    return true;
  } catch (err) {
    console.error('Error completing habit:', err);
    return false;
  }
};

export const updateStreak = async (
  date: string,
  loadHabits?: () => Promise<void>,
) => {
  try {
    const response = await axiosInstance.post('/auth/update_streak', {
      date: date,
    });

    const result = response.data;

    if (!result || !result.success) {
      console.error('Error from server:', result?.message || 'Unknown error');
      return false;
    }

    if (loadHabits) {
      await loadHabits();
    }
    toast.info(`Streak completed for today day ${date}`);
    return true;
  } catch (err) {
    console.error('Error updating streak:', err);
    return false;
  }
};

// deletes a habit by name
export const deleteHabit = async (name: string, loadHabits: () => void) => {
  try {
    const response = await axiosInstance.delete(`/habit/delete_habit/${name}`);
    const result = response.data;
    if (!response.data.success) {
      console.error('Error from server:', result);
      return false;
    } else {
      toast.error(`${name} deleted successfully`);
      await loadHabits();
      return true;
    }
  } catch (error) {
    console.error('Error deleting: ', error);
    return false;
  }
};
