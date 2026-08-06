/**
 * @file ProgressLineChart.tsx
 * @description Candidate readiness score improvements area chart using Recharts styled with pink gradients.
 */

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceDot } from 'recharts';

interface ProgressPoint {
  month: string;
  score: number;
}

const data: ProgressPoint[] = [
  { month: 'Jan', score: 20 },
  { month: 'Feb', score: 22 },
  { month: 'Mar', score: 38 },
  { month: 'Apr', score: 32 },
  { month: 'May', score: 48 },
  { month: 'Jun', score: 42 },
  { month: 'Jul', score: 58 },
  { month: 'Aug', score: 52 },
  { month: 'Sep', score: 68 },
  { month: 'Oct', score: 63 },
  { month: 'Nov', score: 79 },
  { month: 'Dec', score: 87 },
];

export function ProgressLineChart() {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 15,
            right: 15,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(336, 100%, 60%)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(336, 100%, 60%)" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(250, 20%, 7%)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '11px',
              color: '#fff',
            }}
            labelStyle={{ fontWeight: 600, color: 'hsl(336, 100%, 60%)' }}
          />
          <Area
            type="monotone"
            dataKey="score"
            name="Career Growth"
            stroke="hsl(336, 100%, 60%)"
            strokeWidth={3}
            activeDot={{ r: 5, strokeWidth: 0, fill: 'hsl(336, 100%, 60%)' }}
            fillOpacity={1}
            fill="url(#colorScore)"
          />
          {/* Highlight peak point at 87% */}
          <ReferenceDot 
            x="Dec" 
            y={87} 
            r={5} 
            fill="hsl(336, 100%, 60%)" 
            stroke="white" 
            strokeWidth={1.5}
            isFront={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProgressLineChart;
