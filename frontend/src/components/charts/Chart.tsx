import { useCallback, useEffect, useState } from 'react';
import { getUserData } from '../../services/chartService';
import { weekData, timeDayData } from '../../hooks/getChartData';
import LineChartDefault from './WeekTypeChart';
import TimeDayChart from './TimeDayChart';
import HabitHeatmap from './MonthChart';
import ProgressInterface from '../../types/progress';
import '../../assets/css/chart.css';

// function to generate random color codes diferent for each item
// will generate a color based on its index
const generateColor = (index: number) => {
  // 137,5 its prime-related, divide for 360 to guarantee a valid range
  const hue = (index * 137.5) % 360;
  // hsl = Hue, Saturation Lightness
  return `hsl(${hue}, 70%, 60%)`;
};

const Chart = () => {
  type ChartData = { date: string } & Record<string, number>;
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [filter, setFilter] = useState('All');
  // diferents viewModes of chart
  const [viewMode, setViewMode] = useState<
    'weekly' | 'habit' | 'nonnegotiable' | 'monthly' | 'daytime'
  >('weekly');
  const [habits, setHabits] = useState<ProgressInterface[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<ProgressInterface[]>([]);

  const fetchUserData = useCallback(async () => {
    // get user data
    const data = await getUserData();
    setHabits(data);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    // apply the filter based on habit_type
    const filtered =
      filter === 'All' ? habits : habits.filter((h) => h.habit_type === filter);
    setFilteredHabits(filtered);

    // generate chart data from filtered habits
    if (filtered.length > 0) {
      const chartReady = weekData(filtered); // weekdata, from custom hooks
      setChartData(chartReady);
    }
  }, [habits, filter]);

  return (
    <div
      className="p-4 shadow rounded-xl bg-white"
      style={{ marginLeft: '275px', marginRight: '80px', marginTop: '60px' }}
    >
      <h2 className="text-xl font-semibold mb-2">Progress</h2>
      <div className="flex flex-wrap gap-2 my-4">
        <button
          onClick={() => {
            // call each viewMode when button is clicked
            setViewMode('weekly');
            setFilter('All');
          }}
          className={`px-3 btn btn-sm button ms-2 ${viewMode === 'weekly' ? 'active' : ''}`}
        >
          Weekly
        </button>
        <button
          onClick={() => {
            setViewMode('habit');
            setFilter('Habit');
          }}
          className={`px-3 btn btn-sm button ms-2 ${viewMode === 'habit' ? 'active' : ''}`}
        >
          Weekly habits
        </button>
        <button
          onClick={() => {
            setViewMode('nonnegotiable');
            setFilter('Non-negotiable');
          }}
          className={`px-3 btn btn-sm button ms-2 ${viewMode === 'nonnegotiable' ? 'active' : ''}`}
        >
          Weekly non-negotiables
        </button>
        <button
          onClick={() => {
            setViewMode('monthly');
          }}
          className={`px-3 btn btn-sm button ms-2 ${viewMode === 'monthly' ? 'active' : ''}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setViewMode('daytime')}
          className={`px-3 btn btn-sm button ms-2 ${viewMode === 'daytime' ? 'active' : ''}`}
        >
          Daytime
        </button>
      </div>
      {/* render the appropriate chart based on viewMode */}
      {/* time day data from custom hook */}
      {viewMode === 'daytime' && (
        <TimeDayChart data={timeDayData(habits)} />
      )}{' '}
      {viewMode === 'monthly' && <HabitHeatmap data={habits} />}
      {(viewMode === 'weekly' ||
        viewMode === 'habit' ||
        viewMode === 'nonnegotiable') && (
        <LineChartDefault
          chartData={chartData}
          habits={filteredHabits}
          colors={filteredHabits.map((_, index) => generateColor(index))} // generate colors dynamically
        />
      )}
    </div>
  );
};

export default Chart;
