import axiosInstance from '../config/axiosConfig';
import HabitInterface from '../types/habit';

// get all habits with optional filtering by habit type
export const getHabits = async (habitType?: 'Habit' | 'Non-negotiable') => {
  try {
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
    const response = await axiosInstance.post('/habit/create_habit', data);
    if (!response.data.success) {
      console.error('Habit operation failed', response.data.message);
      return false;
    }

    if (loadHabits) {
      await loadHabits();
    }
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
    return true;
  } catch (err) {
    console.error('Error updating habit:', err);
    return false;
  }
};

// function to complete Habits
export const completeHabit = async (
  habitName: string,
  loadHabits?: () => Promise<void>,
) => {
  try {
    const response = await axiosInstance.post(`/habit/complete/${habitName}`);

    if (!response.data || !response.data.success) {
      console.error('Habit completion failed', response.data?.message);
      return false;
    }

    // if loadHabits is provided, call it to refresh the data
    if (loadHabits) {
      await loadHabits();
    }
    return true;
  } catch (err) {
    console.error('Error completing habit:', err);
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
      await loadHabits();
      return true;
    }
  } catch (error) {
    console.error('Error deleting: ', error);
    return false;
  }
};
