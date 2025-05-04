import { useCallback, useState } from 'react';
import HabitInterface from '../../types/habit';
import { getHabits } from '../../services/habitService';

interface UseHabitsProps {
  dayOfWeek: number; // week index
}

const useHabits = ({ dayOfWeek }: UseHabitsProps) => {
  const [habitsToday, setHabitsToday] = useState<HabitInterface[]>([]);
  const [completedToday, setCompletedToday] = useState<HabitInterface[]>([]);
  const [completedWeekly, setCompletedWeekly] = useState<HabitInterface[]>([]);
  const [habitsWeekly, setHabitsWeekly] = useState<HabitInterface[]>([]);
  const [loading, setLoading] = useState(false);

  // get days up to today
  const getDatesUpToTodayThisWeek = useCallback(() => {
    const today = new Date();
    const dates: string[] = [];

    // get actual day and append it to the array
    for (let i = 0; i <= dayOfWeek; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - (dayOfWeek - i));
      dates.push(pastDate.toISOString().split('T')[0]);
    }

    // returns array of dates
    return dates;
  }, [dayOfWeek]);

  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const habits = await getHabits();
      const todayStr = new Date().toISOString().split('T')[0];
      const weekDates = getDatesUpToTodayThisWeek();

      const completedToday: HabitInterface[] = [];
      const completedWeekly: HabitInterface[] = [];

      const filteredHabitsToday = habits.filter((habit: HabitInterface) => {
        // daily completions
        if (habit.completed?.includes(todayStr)) {
          completedToday.push(habit);
        }

        // weekly completions
        if (habit.completed?.some((date: string) => weekDates.includes(date))) {
          completedWeekly.push(habit);
        }

        if (habit.frequency === 'daily') {
          return true;
        }

        // check if the current day of the week is included in the habit's days
        const daysArray = Array.isArray(habit.days)
          ? habit.days
          : String(habit.days)
              .split(',')
              .map((d) => parseInt(d.trim(), 10)); // 10 to avoid decimal

        return daysArray.includes(dayOfWeek);
      });

      setCompletedToday(completedToday);
      setCompletedWeekly(completedWeekly);
      setHabitsToday(filteredHabitsToday);
      setHabitsWeekly([...habits]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dayOfWeek, getDatesUpToTodayThisWeek]);

  // expose fetchHabits for daily and weekly refreshes
  const getHabitsDaily = useCallback(() => fetchHabits(), [fetchHabits]);
  const getHabitsWeekly = useCallback(() => fetchHabits(), [fetchHabits]);

  return {
    fetchHabits,
    habitsToday,
    completedToday,
    completedWeekly,
    habitsWeekly,
    getHabitsDaily,
    getHabitsWeekly,
    loading,
  };
};

export default useHabits;
