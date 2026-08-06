/**
 * @file SkillRadarChart.tsx
 * @description Skill Radar visualization chart using Recharts styled with the pink accent colors.
 */

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SkillData {
  subject: string;
  A: number; // User current level
  B: number; // Market benchmark
  fullMark: number;
}

const data: SkillData[] = [
  { subject: 'DSA', A: 75, B: 70, fullMark: 100 },
  { subject: 'System Design', A: 85, B: 75, fullMark: 100 },
  { subject: 'Front End', A: 90, B: 80, fullMark: 100 },
  { subject: 'Back End', A: 70, B: 85, fullMark: 100 },
  { subject: 'DevOps', A: 60, B: 65, fullMark: 100 },
  { subject: 'Communication', A: 85, B: 75, fullMark: 100 },
  { subject: 'Leadership', A: 65, B: 70, fullMark: 100 },
];

export function SkillRadarChart() {
  return (
    <div className="h-[240px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.06)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Your Skills"
            dataKey="A"
            stroke="hsl(336 100% 60%)"
            fill="hsl(336 100% 60%)"
            fillOpacity={0.35}
          />
          <Radar
            name="Benchmark"
            dataKey="B"
            stroke="rgba(255,255,255,0.2)"
            fill="rgba(255,255,255,0.1)"
            fillOpacity={0.05}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(250, 20%, 7%)',
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '11px',
              color: '#fff',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SkillRadarChart;
