import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const TimeDayChart = ({
  data,
}: {
  data: { name: string; value: number; percent: number }[];
}) => {
  // Colors for segments
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (!data || data.length === 0) return <p>No data yet</p>;

  // Chart field hover
  const ChartHover = ({ activeSlide, payload }: any) => {
    // payload(array) = hoverData that will be displayed
    if (activeSlide && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-sm">
          {/* get day_time name + value */}
          <p>{`${payload[0].name}: ${payload[0].value} Completions`}</p>
          <p>{`${payload[0].payload.percent.toFixed(0)}%`}</p>
        </div>
      );
    }
    return null;
  };

  // show % directly on chart
  const ChartLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, index } = props;
    // calculate coordinates to position percentage label centered on slides
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // % field
    const percentValue = data[index].percent.toFixed(0);

    // if 0% hide it
    if (data[index].percent === 0) {
      return null;
    }

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
      >
        {`${percentValue}%`}
      </text>
    );
  };

  return (
    <div className="d-flex flex-column align-items-start">
      {/* Chart section */}
      <div className="w-100">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              // x, y axis center
              cx="50%"
              cy="50%"
              labelLine={false}
              label={ChartLabel}
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {/* get data for the Chart and assign color */}
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartHover />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Chart legend */}
      <div className="w-100 d-flex justify-content-center mt-2 mb-6">
        <div className="d-inline-flex flex-wrap justify-content-center gap-3 text-center">
          {data.map((entry, index) => (
            <span
              key={index}
              className="d-inline-flex align-items-center text-small"
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {/* Color block + label name */}
              <span className="mr-1">❏</span>
              <span className="fw-medium">{entry.name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeDayChart;
