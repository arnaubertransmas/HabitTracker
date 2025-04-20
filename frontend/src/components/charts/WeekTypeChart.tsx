import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface LineChartProps {
  // interface for LineChart Props
  chartData: { date: string; [key: string]: any }[];
  habits: { habitName: string }[];
  colors: string[];
}

const LineChartDefault = ({ chartData, habits, colors }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid stroke="#e0e0e0" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 1]} tickFormatter={(v) => (v ? '✓' : '✗')} />
        <Tooltip
          labelFormatter={(d) => `Date: ${d}`}
          formatter={(v: any) => (v ? 'Completed' : 'Missed')}
        />
        <Legend />
        {/* legend content --> */}
        {habits.map((habit: { habitName: string }, index: number) => (
          <Line
            key={habit.habitName}
            type="monotone"
            dataKey={habit.habitName}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartDefault;
