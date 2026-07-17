/**
 * @file SkillRadarChart.tsx
 * @description Skill Radar visualization chart using Recharts
 */

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface SkillData {
  subject: string;
  A: number; // User current level
  B: number; // Market benchmark
  fullMark: number;
}

const data: SkillData[] = [
  { subject: 'Frontend', A: 85, B: 75, fullMark: 100 },
  { subject: 'Backend', A: 60, B: 80, fullMark: 100 },
  { subject: 'System Design', A: 50, B: 70, fullMark: 100 },
  { subject: 'DSA', A: 70, B: 75, fullMark: 100 },
  { subject: 'Soft Skills', A: 90, B: 80, fullMark: 100 },
  { subject: 'DevOps & Cloud', A: 45, B: 65, fullMark: 100 },
];

export function SkillRadarChart() {
  return (
    <div className="h-[320px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'var(--muted-foreground)', fontSize: 8 }}
            axisLine={false}
          />
          <Radar
            name="Your Skills"
            dataKey="A"
            stroke="var(--primary)"
            fill="var(--primary)"
            fillOpacity={0.25}
          />
          <Radar
            name="Market Benchmark"
            dataKey="B"
            stroke="#818cf8"
            fill="#818cf8"
            fillOpacity={0.08}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card)',
              borderColor: 'var(--border)',
              borderRadius: '8px',
              fontSize: '11px',
              color: 'var(--foreground)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SkillRadarChart;
