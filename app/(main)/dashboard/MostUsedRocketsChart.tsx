"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Launch } from '@/types';

const COLORS = ['#A78BFA', '#60A5FA', '#34D399', '#FBBF24', '#F87171', '#818CF8', '#FCD34D'];

interface MostUsedRocketsChartProps {
  launches: Launch[];
}

const rocketNames: Record<string, string> = {
  "5e9d0d95eda69955f709d1eb": "Falcon 1",
  "5e9d0d95eda69973a809d1ec": "Falcon 9",
  "5e9d0d95eda69974db09d1ed": "Falcon Heavy",
  "5e9d0d96eda699382d09d1ee": "Starship",
};

const MostUsedRocketsChart = ({ launches }: MostUsedRocketsChartProps) => {
  const rocketCounts: Record<string, number> = {};
  
  launches.forEach((launch) => {
    if (!launch.rocket) return;
    rocketCounts[launch.rocket] = (rocketCounts[launch.rocket] || 0) + 1;
  });

  const rocketUsage = Object.entries(rocketCounts)
    .map(([rocketId, count]) => ({
      name: rocketNames[rocketId] || rocketId,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  if (rocketUsage.length === 0) {
    return (
      <div className="flex items-center justify-center h-[280px] text-gray-500">
        No rocket data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={rocketUsage}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={120}
          paddingAngle={4}
          dataKey="value"
          cx="50%"
          cy="80%"
        >
          {rocketUsage.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default MostUsedRocketsChart;

