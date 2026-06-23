# AI Career Twin — Component-Based Frontend Architecture

This document maps out the entire frontend structure for the AI Career Twin SaaS platform. By isolating the JSX and CSS of every individual component, we ensure that a change to one component has zero side effects on the rest of the application.

---

## 📂 Complete Component Folder Structure (Phases 1 to 5)

Every element has its own folder containing a React Component (`.jsx`) and its scoped stylesheet (`.css`).

```text
src/
├── assets/                       # Static SVGs, 3D Spline assets, Lottie JSONs
├── styles/
│   ├── variables.css             # Design Tokens (Colors, Font scales, Grid sizes)
│   └── global.css                # Global mesh backgrounds & reset styles
├── components/
│   │
│   ├─── [Phase 1: Resume & ATS] ──────────────────────────────────────────
│   ├── ResumeUploader/           # Drag & drop file area
│   │   ├── ResumeUploader.jsx
│   │   └── ResumeUploader.css
│   ├── AtsScorer/                # ATS Score radial gauge & list
│   │   ├── AtsScorer.jsx
│   │   └── AtsScorer.css
│   ├── ResumeEditor/             # Side-by-side editing workspace
│   │   ├── ResumeEditor.jsx
│   │   └── ResumeEditor.css
│   ├── MatchCard/                # Cosine embedding similarity view
│   │   ├── MatchCard.jsx
│   │   └── MatchCard.css
│   │
│   ├─── [Phase 2: Roadmap Generator] ─────────────────────────────────────
│   ├── RoleSelector/             # Target career & study hours input
│   │   ├── RoleSelector.jsx
│   │   └── RoleSelector.css
│   ├── SkillRadar/               # Venn/Radar visual gap chart
│   │   ├── SkillRadar.jsx
│   │   └── SkillRadar.css
│   ├── RoadmapTimeline/          # Interactive week-by-week cards
│   │   ├── RoadmapTimeline.jsx
│   │   └── RoadmapTimeline.css
│   │
│   ├─── [Phase 3: GitHub Analyzer] ───────────────────────────────────────
│   ├── GithubConnector/          # Username input & sync progress
│   │   ├── GithubConnector.jsx
│   │   └── GithubConnector.css
│   ├── CommitHeatmap/            # 3D grid/heatmap of commit frequency
│   │   ├── CommitHeatmap.jsx
│   │   └── CommitHeatmap.css
│   ├── RepoInsights/             # Technology cards & README quality checks
│   │   ├── RepoInsights.jsx
│   │   └── RepoInsights.css
│   │
│   ├─── [Phase 4: Mock Interview Agent] ──────────────────────────────────
│   ├── InterviewConsole/         # Chat terminal showing active questions
│   │   ├── InterviewConsole.jsx
│   │   └── InterviewConsole.css
│   ├── VoiceVisualizer/          # Pulsing microphone waves during audio capture
│   │   ├── VoiceVisualizer.jsx
│   │   └── VoiceVisualizer.css
│   ├── AnswerEvaluator/          # Post-interview response rubrics
│   │   ├── AnswerEvaluator.jsx
│   │   └── AnswerEvaluator.css
│   │
│   ├─── [Phase 5: LinkedIn & Dashboard Integration] ──────────────────────
│   ├── LinkedinImporter/         # PDF profile import drag zone
│   │   ├── LinkedinImporter.jsx
│   │   └── LinkedinImporter.css
│   └── ReadinessDashboard/       # Unified scorecard & hiring actions list
│       ├── ReadinessDashboard.jsx
│       └── ReadinessDashboard.css
```

---

## 🎨 Design Tokens & Custom CSS Properties (`src/styles/variables.css`)

Developers must use these CSS variables to maintain a consistent style throughout the app.

```css
:root {
  /* Color Palette (Cyberpunk Sleek Dark Mode) */
  --bg-primary: #05050a;         /* Deep Space Black */
  --bg-card: rgba(15, 23, 42, 0.45); /* Frosted Slate */
  
  --accent-purple: #8b5cf6;     /* Electric Indigo */
  --accent-cyan: #06b6d4;       /* Neon Blue */
  --color-success: #10b981;     /* Active Green */
  --color-warning: #f59e0b;     /* Warning Amber */
  --color-text-main: #f8fafc;   /* Slate-50 Primary Text */
  --color-text-sub: #94a3b8;    /* Slate-400 Paragraph Copy */
  
  /* Glassmorphism Styles */
  --glass-border: 1px solid rgba(255, 255, 255, 0.05);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --glass-blur: blur(12px);

  /* Typography Design Tokens */
  --font-header: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Font Sizes */
  --size-title-main: 2.25rem;   /* 36px - Page title */
  --size-title-sec: 1.5rem;     /* 24px - Component Header */
  --size-title-card: 1.125rem;  /* 18px - Sub-card Heading */
  --size-body: 0.875rem;        /* 14px - Body/Description */
  --size-detail: 0.75rem;       /* 12px - Tags, Metadata */

  /* Font Weights */
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

---

## 💎 Scoped Component Style Guidelines (For Future Developers)

To prevent stylesheet leaks across components, always import the stylesheet directly inside the component JSX file:

```javascript
// src/components/ResumeUploader/ResumeUploader.jsx
import React from 'react';
import './ResumeUploader.css'; // Class names here only apply to this component

export default function ResumeUploader() {
  return (
    <div className="uploader-container">
      <h3 className="uploader-title">Upload Resume</h3>
    </div>
  );
}
```

And in the corresponding CSS file:

```css
/* src/components/ResumeUploader/ResumeUploader.css */
.uploader-container {
  background: var(--bg-card);
  backdrop-filter: var(--glass-blur);
  border: var(--glass-border);
  box-shadow: var(--glass-shadow);
  padding: 2rem;
  border-radius: 1rem;
}

.uploader-title {
  font-family: var(--font-header);
  font-size: var(--size-title-card);
  font-weight: var(--weight-bold);
  color: var(--color-text-main);
}
```
