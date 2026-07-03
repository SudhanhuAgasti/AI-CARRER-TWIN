/**
 * @file LinkedinOptimizer.tsx
 * @description LinkedIn Profile optimizer containing validation lists and copy-paste suggestions.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { Globe, Sparkles, ClipboardCopy, CheckCircle2, RefreshCw } from 'lucide-react';

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

  const handleFetchSuggestions = async () => {
    if (!profileText.trim()) return;
    setLoading(true);
    try {
      // Use resumeId from store or fallback to a mock MongoDB hex ObjectId
      const resumeId = useResumeStore.getState().resumeId || '64af2c789182390aefd00921';
      
      const response = await axiosInstance.post('/api/linkedin/analyze', {
        resumeId,
        targetRole: 'Senior Software Engineer',
        profileText: profileText.trim()
      });

      const analysis = response.data;
      const mappedSuggestions: Suggestion[] = [
        {
          id: 's-1',
          field: 'Profile Headline',
          original: profileText.slice(0, 50) + '...',
          suggestion: analysis.headlineCheck || 'Senior Engineer',
        },
        {
          id: 's-2',
          field: 'Summary Recommendation',
          original: profileText,
          suggestion: analysis.summaryCheck || 'Optimized Summary Details',
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

  return (
    <div className="space-y-6 text-left">
      
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">LinkedIn Profile Optimizer</h1>
          <p className="text-xs text-muted-foreground">
            Improve your search visibility and candidate indexing scores with tailored copy-paste templates.
          </p>
        </div>
        
        <Button size="sm" onClick={handleFetchSuggestions} isLoading={loading} disabled={!profileText.trim()}>
          <RefreshCw className="mr-1.5 h-4 w-full shrink-0" />
          Fetch Recommendations
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="max-w-xl mx-auto text-left py-12">
          <CardContent className="space-y-4 pt-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Globe className="h-6 w-6" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm font-semibold">LinkedIn Profile Analytics</p>
              <p className="text-xs text-muted-foreground">
                Fetch and evaluate suggestions matching current target career benchmarks.
              </p>
            </div>
            
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Paste Your Current LinkedIn Summary / Headline
              </label>
              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Paste your current LinkedIn summary or headline text here..."
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>

            <Button className="w-full" size="sm" onClick={handleFetchSuggestions} isLoading={loading} disabled={!profileText.trim()}>
              Run Optimizer Analysis
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {data.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-3 pt-5">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                  <Sparkles className="h-4.5 w-4.5 text-primary" />
                  Target Zone: {item.field}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Before */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Before (Original Profile)
                    </span>
                    <div className="rounded-lg bg-muted/40 border border-border p-4 text-xs text-muted-foreground leading-relaxed">
                      {item.original}
                    </div>
                  </div>

                  {/* After / Copy */}
                  <div className="space-y-1.5 text-left flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        After (Optimized Draft)
                      </span>
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-xs text-foreground leading-relaxed font-semibold">
                        {item.suggestion}
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-end mt-2 text-[10px] h-8 font-bold"
                      onClick={() => handleCopy(item.suggestion)}
                    >
                      <ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
                      Copy Optimized Text
                    </Button>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}

export default LinkedinOptimizer;
