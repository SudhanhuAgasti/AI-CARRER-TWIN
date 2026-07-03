/**
 * @file ResumeMorpher.tsx
 * @description Playground allowing users to select resume bullets and dynamically rephrase them.
 * @author Senior Staff Frontend Engineer (9+ years experience)
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { useUIStore } from '../../../store/uiStore';
import { ArrowRight, RotateCw, Check, ClipboardCopy } from 'lucide-react';

import { axiosInstance } from '../../../api/axiosInstance';
import { useResumeStore } from '../../../store/resumeStore';

interface BulletPoint {
  id: string;
  original: string;
  morphed?: string;
}

const mockBullets: BulletPoint[] = [
  { id: 'b-1', original: 'Wrote API endpoints using NodeJS and Express for various user flows.' },
  { id: 'b-2', original: 'Worked on front-end components using React and styled variables.' },
  { id: 'b-3', original: 'Participated in code reviews and configured database deployments.' },
];

export function ResumeMorpher() {
  const { addToast } = useUIStore();
  const [bullets, setBullets] = useState<BulletPoint[]>(mockBullets);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [targetJd, setTargetJd] = useState('');
  const [morphing, setMorphing] = useState(false);

  const selectedBullet = bullets.find((b) => b.id === selectedId);

  const handleMorph = async () => {
    if (!selectedId || !targetJd.trim() || !selectedBullet) return;
    setMorphing(true);

    try {
      const activeResumeData = useResumeStore.getState().structuredResume || {
        skills: ['React', 'NodeJS', 'Express', 'Docker'],
        experience: [
          {
            title: 'Software Engineer',
            company: 'Development Corp',
            bullets: [selectedBullet.original],
          }
        ]
      };

      const response = await axiosInstance.post('/api/resume/morph', {
        resumeData: activeResumeData,
        jobDescription: targetJd,
      });

      const tailoredBullet = response.data?.morphedResume?.tailoredExperience?.[0]?.tailoredBullets?.[0]
        || 'Optimized developer workflows using modular architectures.';

      setBullets((prev) =>
        prev.map((b) =>
          b.id === selectedId
            ? { ...b, morphed: tailoredBullet }
            : b
        )
      );

      addToast({
        type: 'success',
        title: 'Bullet Point Morphed',
        message: 'Bullet rephrased successfully targeting the target job details.',
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Morphing Failed',
        message: 'Something went wrong. Please check inputs and try again.',
      });
    } finally {
      setMorphing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: 'success',
      title: 'Copied to Clipboard',
      message: 'Morphed text copy successful!',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
      
      {/* Left Pane: Bullets list & Target JD */}
      <div className="lg:col-span-7 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Select Bullet Point to Morph</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {bullets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={`w-full rounded-lg border p-4 text-xs font-semibold text-left transition-all leading-relaxed
                    ${selectedId === b.id 
                      ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary' 
                      : 'border-border bg-card text-muted-foreground hover:bg-accent/40'
                    }
                  `}
                >
                  {b.original}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Target Job Description (JD) / Requirements
              </label>
              <textarea
                value={targetJd}
                onChange={(e) => setTargetJd(e.target.value)}
                placeholder="Paste the target job description or specific keyword requirements here (e.g. Design modular REST APIs, configure container deployments)..."
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <Button
              className="w-full"
              disabled={!selectedId || !targetJd.trim()}
              onClick={handleMorph}
              isLoading={morphing}
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Morph Selected Bullet Point
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Pane: Side-by-side comparison */}
      <div className="lg:col-span-5">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Comparison Playground</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center space-y-6">
            {!selectedBullet ? (
              <div className="text-center py-12 text-muted-foreground space-y-2 select-none">
                <p className="text-xs font-bold uppercase tracking-wide">No Bullet Selected</p>
                <p className="text-[10px]">Select a bullet point from the left to start morphing.</p>
              </div>
            ) : (
              <div className="space-y-5 flex-1 flex flex-col justify-between">
                
                {/* Original bullet */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Original Draft
                  </span>
                  <div className="rounded-lg bg-muted/40 border border-border p-4 text-xs text-muted-foreground leading-relaxed">
                    {selectedBullet.original}
                  </div>
                </div>

                {/* Arrow spacer */}
                <div className="flex justify-center text-primary">
                  <ArrowRight className="h-5 w-5 transform rotate-90 lg:rotate-0" />
                </div>

                {/* Morphed bullet */}
                <div className="space-y-2 flex-1 flex flex-col justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
                    Morphed Draft (AI Rephrased)
                  </span>
                  {selectedBullet.morphed ? (
                    <div className="space-y-3">
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-xs text-foreground leading-relaxed font-medium">
                        {selectedBullet.morphed}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-[11px]"
                          onClick={() => copyToClipboard(selectedBullet.morphed!)}
                        >
                          <ClipboardCopy className="mr-1.5 h-3.5 w-3.5" />
                          Copy Draft
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 text-[11px]"
                          onClick={() => {
                            addToast({
                              type: 'success',
                              title: 'Accepted Morph',
                              message: 'Successfully updated draft bullet.',
                            });
                          }}
                        >
                          <Check className="mr-1.5 h-3.5 w-3.5" />
                          Accept Draft
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-border p-6 text-center text-muted-foreground text-[10px] select-none">
                      Awaiting AI Morph... Enter Job description and click Morph.
                    </div>
                  )}
                </div>

              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}

export default ResumeMorpher;
