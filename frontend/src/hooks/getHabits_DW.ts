import { useCallback, useMemo, useState } from 'react';
import HabitInterface from '../types/habit';
import { getHabits } from '../services/habitService';

interface UseHabitsProps {
  dayOfWeek: number;
}

const useHabits = ({ dayOfWeek }: UseHabitsProps) => {
  const [habitsToday, setHabitsToday] = useState<HabitInterface[]>([]);
  const [habitsWeekly, setHabitsWeekly] = useState<HabitInterface[]>([]);
  const [loading, setLoading] = useState(false);

  // Get the week days remaining from today
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => (dayOfWeek + i) % 7);
  }, [dayOfWeek]);

  const getHabitsDaily = useCallback(async () => {
    setLoading(true);
    try {
      const habits = await getHabits();
      // filter habits for today's day
      const filteredHabitsToday = habits.filter((habit: HabitInterface) =>
        habit.days.includes(dayOfWeek),
      );
      // set it in the state
      setHabitsToday(filteredHabitsToday);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dayOfWeek]);

  const getHabitsWeekly = useCallback(async () => {
    setLoading(true);
    try {
      const habits = await getHabits();
      // filter habits for the week days
      // iterate to habit w filter, check if some days math the day of weekDays if there's match, include it to arr
      const filteredHabitsWeekly = habits.filter((habit: HabitInterface) =>
        habit.days.some((day) => weekDays.includes(day)),
      );
      setHabitsWeekly(filteredHabitsWeekly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [weekDays]);

  return {
    habitsToday,
    habitsWeekly,
    getHabitsDaily,
    getHabitsWeekly,
    loading,
  };
};

export default useHabits;
