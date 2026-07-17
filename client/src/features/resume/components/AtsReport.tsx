/**
 * @file AtsReport.tsx
 * @description ATS parsing dashboard displaying grade cards, keyword list metrics, and structure reviews with premium UI/UX.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { CheckCircle2, AlertTriangle, TrendingUp, BookOpen, Sparkles, Award } from 'lucide-react';
import { useResumeStore } from '../../../store/resumeStore';
import { motion } from 'framer-motion';

interface AtsReportProps {
  score?: number;
}

export function AtsReport({ score: propScore = 75 }: AtsReportProps) {
  const storeAtsReport = useResumeStore((state) => state.atsReport) as any;
  const structuredResume = useResumeStore((state) => state.structuredResume);

  const score = storeAtsReport ? storeAtsReport.score : propScore;
  const parsedSkills = structuredResume?.skills || [];

  // Animated score state for count-up effect
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // ms
    const increment = Math.ceil(score / (duration / 16));
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  // Comprehensive tech skill pool to identify missing keywords dynamically
  const defaultSkillsPool = [
    'TypeScript',
    'Kubernetes',
    'CI/CD Pipelines',
    'GraphQL',
    'Tailwind CSS',
    'Docker',
    'AWS',
    'System Design',
    'Microservices',
    'Unit Testing',
    'Redis',
    'Next.js',
    'Python',
    'PostgreSQL'
  ];

  // Matching keywords: actual skills parsed from resume
  const matchingKeywords = storeAtsReport?.keywordOverlap?.matchedKeywords?.length
    ? storeAtsReport.keywordOverlap.matchedKeywords
    : parsedSkills.length
    ? parsedSkills
    : ['React', 'NodeJS', 'MongoDB', 'Express', 'Rest APIs'];

  // Missing keywords
  const missingKeywords = storeAtsReport?.keywordOverlap?.missingKeywords?.length
    ? storeAtsReport.keywordOverlap.missingKeywords
    : parsedSkills.length
    ? defaultSkillsPool
        .filter((skill) => !parsedSkills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase())))
        .slice(0, 5)
    : ['TypeScript', 'Kubernetes', 'CI/CD Pipelines', 'GraphQL', 'Tailwind CSS'];

  // Map backend checks to structural consistency checks
  const structureChecks = storeAtsReport?.checks
    ? storeAtsReport.checks.map((check: any) => ({
        label: check.name,
        passed: check.passed,
        detail: check.detail || (check.passed ? `${check.points} points awarded` : 'No points awarded')
      }))
    : [
        { label: 'Contact Details Present', passed: true, detail: 'Email & phone found' },
        { label: 'Core Skillset Summary Block', passed: true, detail: 'Skills block extracted successfully' },
        { label: 'Work Experience Chronology', passed: true, detail: 'Experience entries detected' },
        { label: 'Education Certifications', passed: true, detail: 'Education section found' },
        { label: 'Measurable Performance Metrics', passed: false, detail: 'Add numeric statistics to experience bullets (e.g. +24% performance improvements).' },
      ];

  // Grade classification styling
  const getGradeDetails = (s: number) => {
    if (s >= 80) return { label: 'Excellent', color: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10', desc: 'Highly optimized for ATS screening!' };
    if (s >= 60) return { label: 'Good', color: 'text-blue-500 border-blue-500/30 bg-blue-500/10', desc: 'Good baseline, but missing key optimizations.' };
    if (s >= 40) return { label: 'Average', color: 'text-amber-500 border-amber-500/30 bg-amber-500/10', desc: 'Needs content additions to bypass basic filters.' };
    return { label: 'Poor', color: 'text-rose-500 border-rose-500/30 bg-rose-500/10', desc: 'High risk of rejection. Critical sections missing.' };
  };

  const grade = getGradeDetails(score);

  // Container variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 animate-fadeIn"
    >
      {/* 2-Column Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Overall Score Indicator */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex">
          <Card className="w-full relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 rounded-2xl flex flex-col justify-center items-center p-8 text-center shadow-xl shadow-background/5">
            {/* Glowing backdrop circle */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardContent className="space-y-6 pt-4 w-full flex flex-col items-center">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1">
                  ATS Scoring Engine
                </span>
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-1.5">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  Match Analytics
                </h2>
              </div>

              {/* Score Gauge */}
              <div className="relative flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)]">
                <svg className="w-40 h-40 transform -rotate-90">
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  {/* Outer track */}
                  <circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Dynamic progress track */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="68"
                    stroke="url(#scoreGradient)"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 68}
                    initial={{ strokeDashoffset: 2 * Math.PI * 68 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 68 * (1 - score / 100) }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold tracking-tighter text-foreground">{displayScore}%</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Overall Fit</span>
                </div>
              </div>

              {/* Grade details */}
              <div className="space-y-3 w-full">
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${grade.color}`}>
                  <Award className="h-3.5 w-3.5" />
                  <span>{grade.label} Grade</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
                  {grade.desc}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right: Structure Checklists */}
        <motion.div variants={itemVariants} className="lg:col-span-8 flex">
          <Card className="w-full bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 rounded-2xl p-6 shadow-xl text-left flex flex-col justify-between">
            <CardContent className="space-y-5 p-0 w-full">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  ATS Structural Checklist
                </h3>
                <span className="text-[10px] text-muted-foreground font-semibold">
                  {structureChecks.filter((c: any) => c.passed).length} / {structureChecks.length} Passed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {structureChecks.map((check: any, idx: number) => (
                  <motion.div 
                    key={idx} 
                    whileHover={{ scale: 1.01, y: -1 }}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                      check.passed 
                        ? 'bg-emerald-500/[0.02] border-emerald-500/10 hover:border-emerald-500/20' 
                        : 'bg-amber-500/[0.02] border-amber-500/10 hover:border-amber-500/20'
                    }`}
                  >
                    {check.passed ? (
                      <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                        <AlertTriangle className="h-4.5 w-4.5" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="font-semibold text-xs text-foreground block leading-tight">{check.label}</span>
                      {check.detail && (
                        <p className="text-[10px] text-muted-foreground leading-relaxed">{check.detail}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Grid: Keyword overlaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">

        {/* Matching keywords */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 rounded-2xl shadow-lg hover:border-emerald-500/20 transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                    Matching Keywords
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Found and parsed from resume</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {matchingKeywords.length > 0 ? (
                  matchingKeywords.map((kw: string) => (
                    <motion.span
                      key={kw}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-500 shadow-sm"
                    >
                      {kw}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No matching keywords identified.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Missing keywords */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 rounded-2xl shadow-lg hover:border-amber-500/20 transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-3">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <BookOpen className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Missing Target Keywords
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Consider adding these to boost overlap</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {missingKeywords.length > 0 ? (
                  missingKeywords.map((kw: string) => (
                    <motion.span
                      key={kw}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-500 shadow-sm"
                    >
                      {kw}
                    </motion.span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-500 font-semibold italic">Perfect keyword coverage! No missing skills.</span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

    </motion.div>
  );
}

export default AtsReport;
