/**
 * @file SkillRadarChart.tsx
 * @description Skill Radar visualization chart using Recharts.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

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
    <div className="h-[300px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            name="Your Skills"
            dataKey="A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.25}
          />
          <Radar
            name="Benchmark"
            dataKey="B"
            stroke="hsl(var(--muted-foreground))"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.05}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SkillRadarChart;
