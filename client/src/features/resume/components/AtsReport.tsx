/**
 * @file AtsReport.tsx
 * @description ATS parsing dashboard displaying grade cards, keyword list metrics, and structure reviews. */

import { Card, CardContent } from '../../../components/ui/Card';
import { CheckCircle2, AlertCircle, TrendingUp, BookOpen, } from 'lucide-react';

import { useResumeStore } from '../../../store/resumeStore';

interface AtsReportProps {
  score?: number;
}

export function AtsReport({ score: propScore = 80 }: AtsReportProps) {
  const storeAtsReport = useResumeStore((state) => state.atsReport);

  const score = storeAtsReport ? storeAtsReport.score : propScore;
  const missingKeywords = storeAtsReport?.missingKeywords || ['TypeScript', 'Kubernetes', 'CI/CD Pipelines', 'GraphQL', 'Tailwind CSS'];
  const matchingKeywords = storeAtsReport?.matchingKeywords || ['React', 'NodeJS', 'MongoDB', 'Express', 'Docker', 'Rest APIs'];

  const structureChecks = storeAtsReport?.structureChecks || [
    { label: 'Contact Details Present', passed: true },
    { label: 'Core Skillset Summary Block', passed: true },
    { label: 'Work Experience Chronology', passed: true },
    { label: 'Education Certifications', passed: true },
    { label: 'Measurable Performance Metrics', passed: false, detail: 'Add numeric statistics to experience bullets (e.g. +24% performance improvements).' },
  ];

  return (
    <div className="space-y-6">

      {/* 2-Column Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* Left: Overall Score Indicator */}
        <Card className="md:col-span-4 flex flex-col justify-center items-center p-6 text-center">
          <CardContent className="space-y-4 pt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              ATS Overlap Score
            </span>

            <div className="relative flex items-center justify-center">
              {/* Radial Score Gauge using SVG */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 54}
                  strokeDashoffset={2 * Math.PI * 54 * (1 - score / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold tracking-tight">{score}%</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Overall</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {score >= 80 ? 'Excellent match alignment for the target job description!' : 'Optimize resume content to match missing keywords.'}
            </p>
          </CardContent>
        </Card>

        {/* Right: Structure Checklists */}
        <Card className="md:col-span-8 p-6 text-left">
          <CardContent className="space-y-4 pt-6 p-0">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              Structural Consistency Checks
            </h3>

            <div className="space-y-3">
              {structureChecks.map((check, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs leading-normal">
                  {check.passed ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground">{check.label}</span>
                    {!check.passed && check.detail && (
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{check.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Keyword overlaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

        {/* Matching keywords */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">              Matching Target Keywords ({matchingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {matchingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-500"
                >
                  {kw}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing keywords */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Missing Target Keywords ({missingKeywords.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-1 text-xs font-medium text-amber-500"
                >
                  {kw}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

export default AtsReport;
