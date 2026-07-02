# AI Career Twin — Production Frontend Architecture & Implementation Plan

This document outlines the architectural blueprint, state management design, and phase-by-phase implementation roadmap for the AI Career Twin SaaS frontend application.

---

## 🛠️ Tech Stack & Architectural Principles

### 1. Technology Stack
* **Framework:** React 19 + TypeScript + Vite (optimized for fast compile times and modern bundling)
* **Styling:** Tailwind CSS (curated design system using custom HSL values for premium dark/light mode switches, inspired by Linear/Vercel)
* **Routing:** React Router DOM (fully typed file-based or layout-centric declarations)
* **Server State:** TanStack Query v5 (caching, deduplication, automatic retries, and optimistic updates)
* **Client State:** Zustand (lightweight, stateless stores for transient UI states, tokens, and active sessions)
* **API Client:** Axios (fully configured instance with request/response interceptors, auth headers, and automatic JWT token refresh)
* **Forms:** React Hook Form + Zod (for declarative schema-based front-end validations)
* **Animations:** Framer Motion (for premium micro-interactions, page-level transitions, and dashboard elements)
* **Visualization:** Recharts (responsive charting library for skill radars, progress lines, and commit heatmaps)
* **Icons:** Lucide React

### 2. Architecture Principles
* **Feature-Based Structure:** All components, hooks, assets, routes, and services are grouped under their respective domain-feature folders (e.g., `features/ats`, `features/interview`) to ensure scalability.
* **SOLID Principles:** Small, focused single-responsibility React hooks and components. Custom hooks abstract complex state/API logic.
* **Clean Architecture:** Keep domain/business models (Types) separated from presentation components and infrastructure (API/Axios configuration).
* **Strict Types:** `noImplicitAny: true` is enforced. No `any` keywords are permitted.

---

## 📂 Project Folder Structure

```
client/
  src/
    app/                   # App-wide providers, routing configuration, main entrypoint
    assets/                # Static assets (images, global icons)
    components/            # Shared reusable presentational elements
      ui/                  # Atomic controls (Buttons, Dialogs, Inputs, Skeletons)
      common/              # Multi-purpose wrappers (EmptyState, ErrorBoundary, Toast)
      layout/              # Common shell frameworks (Navbar, Sidebar, Footer)
    features/              # Domain-specific feature modules
      auth/                # Login, Register, Forgot Password, OTP
      dashboard/           # Analytics, Readiness scores, Recent Activity
      resume/              # Uploaders, AST reports, Morpher interface
      skill-gap/           # Roadmaps, Weekly planner, Micro-project specs
      github/              # Heatmaps, AST inspectors, file trees
      interview/           # Live interview lobby, Timer, Audio recorder, feedback
      linkedin/            # LinkedIn Profile optimization dashboards
      settings/            # Profile keys, notification toggles, theme configurations
    hooks/                 # Shared generic hooks (useLocalStorage, useDebounce, useMediaQuery)
    services/              # Core business services (API wrappers, mock data)
    api/                   # Axios HTTP Client instance and token refreshes
    store/                 # Global Zustand state files
    routes/                # Guarded route controls
    styles/                # CSS configuration files, themes, animations
    types/                 # Universal TypeScript definitions
    utils/                 # Reusable utility functions
    constants/             # Config arrays, select choices, static copies
```

---

## 🗓️ Phase-by-Phase Roadmap

### **Phase 1: Project Setup, Boilerplate & API Layer**
* Initialize Vite + React 19 + TypeScript inside `/client`.
* Configure Tailwind CSS (curated Linear/Stripe dark aesthetics), absolute imports `@/*`, and tsconfig.
* Setup custom Axios client (`axiosInstance.ts`) with request/response interceptors for token injection, refresh token handling, and typed responses.
* Initialize TanStack Query client wrapper and global stores (Zustand).

### **Phase 2: Common UI, Shared Layouts & Theme Systems**
* Setup base Tailwind styles, custom color variables (curated HSL dark/light modes), and common animations.
* Build structural layout components: `Sidebar`, `Navbar`, `AuthLayout`, `DashboardLayout`, and common UI components (buttons, inputs, cards, skeletons).
* Integrate `Lucide React` for typography and icons.

### **Phase 3: Auth & Protection Guards**
* Build screens for: `Login`, `Register`, `Forgot Password`, `Reset Password`, and `OTP Verification` using `React Hook Form` + `Zod` validation schemas.
* Implement route guards (`ProtectedRoute`, `PublicRoute`) and mock/real state synchronization.

### **Phase 4: Dashboard & Analytics Visualization**
* Build the Unified Readiness Dashboard (`/dashboard`) showcasing the aggregated hiring readiness score, status cards, and notification feeds.
* Implement interactive analytics charts (radars, line progress charts) using `Recharts` to visualize skill coverage.

### **Phase 5: Resume + ATS Analyzer Suite**
* Drag-and-drop file upload zone supporting PDF/DOCX.
* Build the ATS analysis panel (grading checkmarks, keyword overlaps, formatting reports).
* Implement the **Resume Morpher UI** allowing users to select bullet points and dynamically morph them targeting specific JDs.

### **Phase 6: Skill Gap & Learning Roadmap**
* Develop target role selection panel.
* Implement the interactive, responsive learning timeline nodes.
* Build the weekly study planner widget and micro-project details board.

### **Phase 7: Live Mock Interview Sandbox**
* Implement Mock Interview Lobby (duration, experience level selection).
* Create conversational chat interface with real-time audio/speech telemetry capture (integrating browser audio recorders).
* Build the final interview evaluation report panel showing strengths and actionable improvements.

### **Phase 8: GitHub, LinkedIn Optimizers & Settings Control**
* Build GitHub AST inspector, repo list browser, and commit heatmaps.
* Implement LinkedIn import parser and suggestion grids.
* Build settings manager (API keys, security settings, user profiles, theme togglers).
