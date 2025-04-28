import { useCallback, useState } from 'react';
import HabitInterface from '../types/habit';
import { getHabits } from '../services/habitService';

interface UseHabitsProps {
  dayOfWeek: number;
}

const useHabits = ({ dayOfWeek }: UseHabitsProps) => {
  const [habitsToday, setHabitsToday] = useState<HabitInterface[]>([]);
  const [habitsWeekly, setHabitsWeekly] = useState<HabitInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const habits = await getHabits();

      // filter habits for todays day
      const filteredHabitsToday = habits.filter((habit: HabitInterface) => {
        // if freq == daily apply it auto to days arr
        if (habit.frequency === 'daily') {
          return true;
        }

        // other frequencies, check days arr
        const daysArray = Array.isArray(habit.days)
          ? habit.days
          : String(habit.days)
              .split(',')
              .map((d) => parseInt(d.trim())); // convert into int ignoring spaces

        const isForToday = daysArray.includes(dayOfWeek);
        return isForToday;
      });

      // craete new arr appending habits at the end
      const filteredHabitsWeekly = [...habits];

      // update states
      setHabitsToday(filteredHabitsToday);
      setHabitsWeekly(filteredHabitsWeekly);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dayOfWeek]);

  // memorize functions w useCallback
  const getHabitsDaily = useCallback(() => {
    return fetchHabits();
  }, [fetchHabits]);

  const getHabitsWeekly = useCallback(() => {
    return fetchHabits();
  }, [fetchHabits]);

  return {
    habitsToday,
    habitsWeekly,
    getHabitsDaily,
    getHabitsWeekly,
    loading,
  };
};

export default useHabits;
