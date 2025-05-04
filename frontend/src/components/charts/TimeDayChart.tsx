import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const TimeDayChart = ({
  data,
}: {
  data: { name: string; value: number; percent: number }[];
}) => {
  // segment colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (!data || data.length === 0) return <p>No data yet</p>;

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
    <div className="flex flex-col items-start">
      {/* Chart section */}
      <div className="w-full">
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
            {/* <Tooltip content={<ChartHover />} /> */}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Chart legend */}
      <div className="w-full flex justify-center mt-2 mb-6">
        <div className="inline-flex flex-wrap justify-center gap-x-4 gap-y-2 text-center">
          {data.map((entry, index) => (
            <span
              key={index}
              className="inline-flex items-center text-sm"
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {/* Color block + label name */}
              <span className="mr-1">❏</span>
              <span className="font-medium">{entry.name} </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeDayChart;
