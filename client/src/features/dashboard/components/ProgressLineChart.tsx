/**
 * @file ProgressLineChart.tsx
 * @description Candidate readiness score improvements area chart using Recharts.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ProgressPoint {
  week: string;
  score: number;
}

const data: ProgressPoint[] = [
  { week: 'Week 1', score: 45 },
  { week: 'Week 2', score: 50 },
  { week: 'Week 3', score: 58 },
  { week: 'Week 4', score: 62 },
  { week: 'Week 5', score: 71 },
  { week: 'Week 6', score: 79 },
];

export function ProgressLineChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ fontWeight: 600, color: 'hsl(var(--foreground))' }}
          />
          <Area
            type="monotone"
            dataKey="score"
            name="Readiness Score"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorScore)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProgressLineChart;
