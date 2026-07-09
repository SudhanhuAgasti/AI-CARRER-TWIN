/**
 * @file InterviewFeedback.tsx
 * @description Mock Interview session evaluation feedback details */

import { Card, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { Award, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

interface FeedbackProps {
  onRestart: () => void;
}

export function InterviewFeedback({ onRestart }: FeedbackProps) {
  const apiData = (window as any).__lastInterviewFeedback || null;
  const overallScore = apiData?.finalFeedback?.overallScore || 7.8;

  const scores = [
    { label: 'Technical Accuracy', rating: apiData?.finalFeedback?.overallScore ? `${apiData.finalFeedback.overallScore}/10` : '8.2/10', color: 'text-primary' },
    { label: 'Articulation & Speed', rating: apiData?.vocalTelemetry?.articulationSpeed || '7.5/10', color: 'text-indigo-400' },
    { label: 'Keyword Coverage', rating: apiData?.finalFeedback?.keywordCoverage || '7.8/10', color: 'text-emerald-400' },
  ];

  const speechTranscripts = apiData?.evaluations?.map((ev: any) => ({
    question: ev.question,
    candidateResponse: ev.answer,
    suggestedScript: ev.feedback || 'Try incorporating more structured metrics and clear API definitions.',
  })) || [
      {
        question: 'How would you design a stateless compilation verification pipeline that signs log telemetry securely?',
        candidateResponse: 'I would write a cryptographically signed HMAC token payload matching client telemetry configurations, validating container latency records on a stateless endpoint.',
        suggestedScript: 'Utilize Node.js crypto timingSafeEqual to avoid timing breaches. Wrap process latency and container metadata logs inside an HMAC-SHA256 signature payload. The endpoint verifies logs statelessly by recalculating signature hashes.',
      },
    ];

  return (
    <div className="space-y-6 text-left">

      {/* Overview evaluation cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* Left Score Gauge */}
        <Card className="md:col-span-4 flex flex-col justify-center items-center p-6 text-center">
          <CardContent className="space-y-4 pt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              Overall Performance
            </span>
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary/30 bg-primary/5">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-primary">{overallScore}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Out of 10</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              You demonstrate solid technical architecture depth but need to structure container logs definitions.
            </p>
          </CardContent>
        </Card>

        {/* Right breakdown checklist */}
        <Card className="md:col-span-8 p-6">
          <CardContent className="space-y-5 pt-6 p-0">
            <h3 className="text-sm font-bold flex items-center gap-1.5 text-foreground">
              <Award className="h-4.5 w-4.5 text-primary" />
              Evaluation Metrics Breakdown
            </h3>

            <div className="space-y-4.5">
              {scores.map((score, idx) => (
                <div key={idx} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <span className="text-xs font-semibold text-muted-foreground">{score.label}</span>
                  <span className={`text-sm font-extrabold ${score.color}`}>{score.rating}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spoken script improvements suggestions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Spoken Script Adjustments</h3>
        <Card>
          <CardContent className="p-0 divide-y divide-border/40">
            {speechTranscripts.map((item: any, idx: number) => (
              <div key={idx} className="p-6 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                    Interviewer Question
                  </span>
                  <p className="text-xs font-bold text-foreground leading-relaxed">{item.question}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      Your Answer (Speech Transcribed)
                    </span>
                    <div className="rounded-lg bg-muted/40 border border-border p-4 text-[11px] text-muted-foreground leading-relaxed">
                      {item.candidateResponse}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Recommended articulation draft
                    </span>
                    <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-4 text-[11px] text-foreground leading-relaxed font-semibold">
                      {item.suggestedScript}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="text-center pt-2">
        <Button variant="outline" onClick={onRestart}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to Interview Lobby
        </Button>
      </div>

    </div>
  );
}

export default InterviewFeedback;
