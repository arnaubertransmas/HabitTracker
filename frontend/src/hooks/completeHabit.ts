import { useState } from 'react';
import HabitInterface from '../types/habit';
import { completeHabit } from '../services/habitService';

export const useHabitCompletion = (loadHabits: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize date format to ensure consistent comparison
  const normalizeDate = (date: string | Date): string => {
    if (!date) return '';
    // convert it to str
    const dateString = date instanceof Date ? date.toISOString() : date;
    // format to YYYY-MM-DD
    return dateString.split('T')[0];
  };

  // Check if habit is completed for a specific date
  const isHabitCompleted = (
    habit: HabitInterface,
    habitClickedDate?: string,
  ): [string, 'success' | 'danger', boolean] => {
    // if no date is provided we'll use today's date
    const dateToCheck = habitClickedDate || new Date().toISOString();
    const normalizedDate = normalizeDate(dateToCheck);
    const normalizedCompletedDates = habit.completed?.map(normalizeDate) || [];
    const isCompleted = normalizedCompletedDates.includes(normalizedDate);
    return isCompleted
      ? ['Completed', 'success', true]
      : ['Pending', 'danger', false];
  };

  // validate selected date
  const validateDateForCompletion = (
    selectedDate: string,
  ): [boolean, string | null] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const normalizedToday = normalizeDate(today);
    const normalizedSelectedDate = normalizeDate(selectedDate);

    const selectedDateObj = new Date(normalizedSelectedDate);
    const todayObj = new Date(normalizedToday);

    // forbid date completion for non-today days
    if (selectedDateObj > todayObj) {
      return [false, 'Cannot complete habits for future dates'];
    } else if (selectedDateObj < todayObj) {
      return [false, 'Cannot complete habits for past dates'];
    }
    return [true, null];
  };

  const handleCompleteHabit = async (
    habitName: string,
    selectedDate: string,
    habit: HabitInterface | null,
    setHabit: React.Dispatch<React.SetStateAction<HabitInterface | null>>,
    handleClose: () => void,
  ): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const date = normalizeDate(selectedDate);

      if (!habit) {
        setError('Error: No habit provided');
        return;
      }
      // date validation
      if (!validateDateForCompletion(selectedDate)) {
        return;
      }

      const success = await completeHabit(habitName, date);

      if (success) {
        // Update local state first
        if (habit) {
          const updatedHabit = { ...habit };
          updatedHabit.completed = [...(updatedHabit.completed || []), date];
          setHabit(updatedHabit);
        }

        // reload habits
        await loadHabits();

        // wait for 1 second before closing the modal to allow the user to see the success operation
        setTimeout(() => handleClose(), 1000);
      } else {
        setError('Failed to mark habit as complete');
      }
    } catch (error) {
      console.error('Error marking habit as complete:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Convert day indices to day names
  const daysIndicesToFullNames = (days: number[] | undefined): string => {
    if (!days || days.length === 0) return 'No days set';
    // if it's double-wrapped, grab the one from inside
    const flatDays = Array.isArray(days[0]) ? days[0] : days;
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return flatDays
      .map((dayIndex) => dayNames[dayIndex] || 'Invalid day')
      .join(', ');
  };

  // Check if habit should be available for completion on a specific day
  const isHabitAvailableForDate = (
    habit: HabitInterface,
    date: string | undefined,
  ): boolean => {
    // If no date specified, use today
    const targetDate = date ? new Date(normalizeDate(date)) : new Date();
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // If habit has specified days, check if today is one of them
    if (habit.days && habit.days.length > 0) {
      const flatDays = Array.isArray(habit.days[0])
        ? habit.days[0]
        : habit.days;
      return flatDays.includes(dayOfWeek);
    }

    // If no days specified, assume habit is available every day
    return true;
  };

  return {
    isLoading,
    error,
    normalizeDate,
    isHabitCompleted,
    handleCompleteHabit,
    daysIndicesToFullNames,
    isHabitAvailableForDate,
    validateDateForCompletion,
    clearError: () => setError(null),
  };
};
