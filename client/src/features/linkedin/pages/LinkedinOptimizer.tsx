/**
 * @file LinkedinOptimizer.tsx
 * @description LinkedIn Profile optimizer containing validation lists and copy-paste suggestions with a premium UI/UX.
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { Globe, Sliders, ClipboardCopy, CheckCircle2, RefreshCw, AlertCircle, Briefcase, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { axiosInstance } from '../../../api/axiosInstance';
import { useResumeStore } from '../../../store/resumeStore';

interface Suggestion {
  id: string;
  field: string;
  original: string;
  suggestion: string;
}

export function LinkedinOptimizer() {
  const { addToast } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Suggestion[]>([]);
  const [profileText, setProfileText] = useState('I am a developer with experience in JavaScript databases.');
  const [targetRole, setTargetRole] = useState('Senior Software Engineer');

  const storeResumeId = useResumeStore((state) => state.resumeId);
  const structuredResume = useResumeStore((state) => state.structuredResume);
  const isValidObjectId = !!(storeResumeId || structuredResume);

  const handleFetchSuggestions = async () => {
    if (!profileText.trim()) return;
    setLoading(true);
    try {
      if (!isValidObjectId) {
        addToast({
          type: 'error',
          title: 'Resume Context Required',
          message: 'Please upload your resume first on the Resume + ATS Analyzer page.',
        });
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post('/api/linkedin/analyze', {
        resumeId: storeResumeId || '000000000000000000000000',
        targetRole: targetRole.trim(),
        profileText: profileText.trim()
      });

      const analysis = response.data;

      const headlineStr = typeof analysis.headlineCheck === 'object' && analysis.headlineCheck
        ? `Strength: ${analysis.headlineCheck.strength}\n\nSuggestions:\n${analysis.headlineCheck.suggestions?.map((s: string) => `• ${s}`).join('\n') || ''}`
        : String(analysis.headlineCheck || 'Senior Engineer');

      const summaryStr = typeof analysis.summaryCheck === 'object' && analysis.summaryCheck
        ? `Quality Score: ${analysis.summaryCheck.qualityScore}/10\n\nAnalysis:\n${analysis.summaryCheck.analysis}\n\nMissing Keywords:\n${analysis.summaryCheck.missingKeywords?.join(', ') || 'None'}`
        : String(analysis.summaryCheck || 'Optimized Summary Details');

      const mappedSuggestions: Suggestion[] = [
        {
          id: 's-1',
          field: 'Profile Headline',
          original: profileText.slice(0, 80) + (profileText.length > 80 ? '...' : ''),
          suggestion: headlineStr,
        },
        {
          id: 's-2',
          field: 'Summary Recommendation',
          original: profileText,
          suggestion: summaryStr,
        }
      ];

      setData(mappedSuggestions);
      addToast({
        type: 'success',
        title: 'LinkedIn Optimization Loaded',
        message: 'Loaded profile recommendations.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Fetch Failed',
        message: 'Could not fetch suggestions. Make sure a resume is uploaded first.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Optimization text copy successful!',
    });
  };

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
      className="space-y-8 text-left animate-fadeIn"
    >
      {/* Workspace Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Globe className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">LinkedIn Profile Optimizer</h1>
          </div>
          <p className="text-xs text-muted-foreground max-w-xl">
            Improve your search visibility and candidate indexing scores with tailored copy-paste templates aligned to recruiter search queries.
          </p>
        </div>

        {data.length > 0 && (
          <Button
            size="sm"
            onClick={handleFetchSuggestions}
            isLoading={loading}
            disabled={!profileText.trim() || !isValidObjectId}
            className="shadow-md shadow-primary/10 hover:shadow-lg transition-all"
          >
            <RefreshCw className="mr-1.5 h-4 w-4 shrink-0" />
            Re-run Analysis
          </Button>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {data.length === 0 ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 rounded-2xl shadow-xl p-8">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <CardContent className="space-y-6 p-0">
                <div className="flex flex-col items-center text-center space-y-3 pb-2 border-b border-border/40">
                  <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Globe className="h-7 w-7 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">LinkedIn Profile Analytics</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Fetch and evaluate suggestions matching current target career benchmarks.
                    </p>
                  </div>
                </div>

                {!isValidObjectId && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold block">Resume Context Required</span>
                      <p className="leading-relaxed">Please upload your resume first on the Resume page. LinkedIn optimization requires parsing skills and structure from your resume.</p>
                    </div>
                  </motion.div>
                )}

                {/* Target Role Input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5" />
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2.5 text-xs text-foreground outline-none focus:border-primary focus:bg-background transition-all"
                  />
                </div>

                {/* Text Area */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      Paste Current Summary or Headline
                    </label>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {profileText.length} characters
                    </span>
                  </div>
                  <textarea
                    value={profileText}
                    onChange={(e) => setProfileText(e.target.value)}
                    placeholder="Paste your current LinkedIn summary or headline text here..."
                    rows={6}
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-xs text-foreground outline-none focus:border-primary focus:bg-background transition-all leading-relaxed"
                  />
                </div>

                <Button
                  className="w-full shadow-lg shadow-primary/10 py-5 rounded-xl font-bold"
                  size="sm"
                  onClick={handleFetchSuggestions}
                  isLoading={loading}
                  disabled={!profileText.trim() || !isValidObjectId}
                >
                  Run Optimizer Analysis
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="suggestions-list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {data.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Card className="bg-gradient-to-br from-background via-background to-accent/5 border border-border/50 rounded-2xl shadow-xl overflow-hidden hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="pb-3 pt-5 border-b border-border/30 bg-accent/[0.02] px-6">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                      <Sliders className="h-4.5 w-4.5 text-primary" />
                      Optimized Section: {item.field}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                      {/* Before */}
                      <div className="space-y-2 flex flex-col">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block">
                          Before (Original Profile)
                        </span>
                        <div className="flex-1 rounded-xl bg-muted/30 border border-border/40 p-4 text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                          {item.original}
                        </div>
                      </div>

                      {/* After / Copy */}
                      <div className="space-y-2 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            After (Optimized Draft)
                          </span>
                          <div className="rounded-xl bg-emerald-500/[0.02] border border-emerald-500/20 p-4 text-xs text-foreground leading-relaxed font-medium whitespace-pre-line">
                            {item.suggestion}
                          </div>
                        </div>

                        <div className="flex justify-end pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] h-9 font-bold rounded-lg border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 transition-all px-4"
                            onClick={() => handleCopy(item.suggestion)}
                          >
                            <ClipboardCopy className="mr-1.5 h-4 w-4" />
                            Copy Draft
                          </Button>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setData([]);
                  setProfileText('');
                }}
                className="text-xs"
              >
                Clear Results & Reset
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default LinkedinOptimizer;
