import { create } from 'zustand';

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

export const useResumeStore = create<ResumeState>((set) => ({
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
}));

export default useResumeStore;
