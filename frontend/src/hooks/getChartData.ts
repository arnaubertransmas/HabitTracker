import ProgressInterface from '../types/progress';

// generate weekly data for the chart
export const weekData = (habits: ProgressInterface[]) => {
  const allDatesSet = new Set<string>();

  habits.forEach((habit) => {
    // iterate completed habit list
    habit.completed.forEach((date: string) => {
      allDatesSet.add(date);
    });
  });

  // get the last 7 days
  const allDates = Array.from(allDatesSet).sort().slice(-7);

  const chartData = allDates.map((date) => {
    const entry: any = { date };

    // check if habit is completed at date, if it is = 1, if not 0
    habits.forEach((habit) => {
      entry[habit.habitName] = habit.completed.includes(date) ? 1 : 0;
    });

    return entry;
  });

  return chartData;
};

// generate time_of_day data for the chart
export const timeDayData = (habits: ProgressInterface[]) => {
  // initialize different time_data
  const timeDayCount = {
    Morning: 0,
    Afternoon: 0,
    Night: 0,
  };

  let totalCompletions = 0;

  // count completions for each time_day
  habits.forEach((habit) => {
    const timeDay = habit.time_day as keyof typeof timeDayCount;
    const completions = habit.completed?.length || 0;

    // count if the timeDay is valid and complete
    if (timeDay && completions > 0) {
      timeDayCount[timeDay] += completions;
      totalCompletions += completions;
    }
  });

  // convert to array with percentages
  return Object.entries(timeDayCount).map(([name, value]) => ({
    name,
    value,
    percent: totalCompletions > 0 ? (value / totalCompletions) * 100 : 0,
  }));
};
