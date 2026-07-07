import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AtsReportData {
  score: number;
  breakdown?: {
    formatting?: number;
    sections?: number;
    keywords?: number;
  };
  missingKeywords: string[];
  matchingKeywords: string[];
  structureChecks?: Array<{ label: string; passed: boolean; detail?: string }>;
}

interface ResumeState {
  resumeId: string | null;
  reportId: string | null;
  structuredResume: any | null;
  atsReport: AtsReportData | null;
  setResumeData: (data: {
    ids: { resumeId: string | null; reportId: string | null };
    structuredResume: any;
    ats: AtsReportData;
  }) => void;
  clearResumeData: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resumeId: null,
      reportId: null,
      structuredResume: null,
      atsReport: null,
      setResumeData: (data) =>
        set({
          resumeId: data.ids.resumeId,
          reportId: data.ids.reportId,
          structuredResume: data.structuredResume,
          atsReport: data.ats,
        }),
      clearResumeData: () =>
        set({
          resumeId: null,
          reportId: null,
          structuredResume: null,
          atsReport: null,
        }),
    }),
    {
      name: 'ai-career-twin-resume',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useResumeStore;
