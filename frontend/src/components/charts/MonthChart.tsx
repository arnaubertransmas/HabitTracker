import React from 'react';
import ProgressInterface from '../../types/progress';
import '../../assets/css/chart.css';

interface MonthChartProps {
  data: ProgressInterface[];
}

const MonthChart: React.FC<MonthChartProps> = ({ data }) => {
  // get month days
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // create arr w month days and iterate over them showing index in str format
  // _ bc arr values are undefined so with _ it's not revelant
  const days = [...Array(daysInMonth)].map((_, i) => `${i + 1}`);
  // arr with habitNames
  const habits = data.map((d) => d.habitName);

  // generate data for heatchart
  const getCompletionCount = (habitName: string, day: string): number => {
    const habitEntry = data.find((d) => d.habitName === habitName);
    if (!habitEntry) return 0;

    // filter arr of dates (habitEntry.completed) to find all dates that match specific day
    const matches = habitEntry.completed.filter((dateStr) => {
      const date = new Date(dateStr);
      return date.getDate() === Number(day);
    });

    return matches.length;
  };

  return (
    <div className="custom-heatmap-container">
      {/* Day labels (x-axis) */}
      <div className="heatmap-row day-labels">
        <div className="habit-label-spacer"></div>
        {days.map((day) => (
          <div key={`day-${day}`} className="day-label">
            {day}
          </div>
        ))}
      </div>

      {/* Habit rows (y-axis) */}
      {habits.map((habit) => (
        <div key={habit} className="heatmap-row">
          <div className="habit-label">{habit}</div>
          {days.map((day) => {
            const completionCount = getCompletionCount(habit, day);
            return (
              <div
                key={`${habit}-${day}`}
                className={'heatmap-cell'}
                style={{
                  backgroundColor: completionCount ? '#4285f4' : 'transparent',
                }}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MonthChart;
