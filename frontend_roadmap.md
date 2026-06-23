# AI Career Twin — Premium Frontend Architecture & Visual Roadmap

This document serves as the implementation blueprint for the **Frontend Application** of the AI Career Twin SaaS platform. It contains exact UI/UX specifications, animation structures, 3D rendering guidelines, and transition rules. 

Any developer or AI agent can use this roadmap to construct a premium, state-of-the-art web interface that interfaces with the backend.

---

## 🎨 Design System & Styling Rules

* **Visual Theme:** **Dark Glassmorphic Cyberpunk** (Frosted glass controls floating over vibrant mesh-gradient backgrounds).
* **Color Palette:**
  * **Background:** Deep Navy/Black (`#05050A`)
  * **Primary/Accent:** Electric Purple (`#8B5CF6`) and Neon Cyan (`#06B6D4`)
  * **Success:** Emerald Green (`#10B981`)
  * **Card Fill:** Translucent Slate (`rgba(15, 23, 42, 0.4)`) with backdrop blur (`blur-md`) and a subtle white border (`rgba(255, 255, 255, 0.05)`).
* **Typography:** Modern Sans-Serif (Google Fonts: **Outfit** for headers, **Inter** for body text).

---

## 🏁 Phase-Wise Frontend Roadmap

### 📦 Phase 1: Foundation & Glassmorphic Shell
*Objective: Build the base responsive layout and premium glass components.*

1. **Tech Stack Selection:** React (Vite) or Next.js, with TailwindCSS for styling and `lucide-react` for premium icons.
2. **Ambient Mesh Background:**
   * Create absolute positioned blurred blobs (`blur-[120px]`) in the background corners that slowly rotate using CSS keyframe animations.
3. **frosted Glass Card Component:**
   * Create a reusable wrapper component utilizing Tailwind:
     ```html
     <div class="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl shadow-xl shadow-black/30">
       <!-- Content -->
     </div>
     ```
4. **Layout Navigation:**
   * Create a top floating glass navigation bar to switch between the **ATS Resume Scorer** and the **Roadmap Planner**.

---

### 💫 Phase 2: Micro-Interactions & Framer Motion Transitions
*Objective: Bring the UI to life with smooth, physics-based animations.*

1. **Staggered Form Lists:**
   * When the ATS checklist or skill gaps list loads, cards should slide up one-by-one with a `0.05s` delay between each list item using Framer Motion:
     ```javascript
     const containerVariants = {
       hidden: { opacity: 0 },
       show: { transition: { staggerChildren: 0.08 } }
     };
     ```
2. **Spring-Physics Card Expansions:**
   * The Roadmap weeks should be clickable Accordions. When clicked, they expand to show tasks and learning resources using spring transitions (`type: "spring", stiffness: 120, damping: 15`) to prevent rigid, robotic expansions.
3. **Skeleton Loading Shimmers:**
   * Show animated gray gradients pulsing smoothly while uploading/processing resumes.

---

### 🔮 Phase 3: 3D Visuals & Immersive Elements
*Objective: Add depth using interactive mouse-tracking 3D models and perspective tilts.*

1. **Interactive 3D Avatar (AI Career Twin):**
   * Integrate an interactive 3D robot head/globe designed in **Spline** or **Three.js**.
   * Add a mouse-tracking script so the 3D model looks in the direction of the user's cursor.
   * Add active animation triggers: when the file is dropped, the model glows and spins rapidly.
2. **Card Tilt Effect (Perspective Hover):**
   * Bind `vanilla-tilt` or custom CSS transforms on the main ATS Score Card.
   * Hovering over the card should tilt it relative to the mouse coordinate, creating a premium light-reflection (glare) effect.

---

### 🎉 Phase 4: Gamification & Success Feedback
*Objective: Encourage task completion and reward progress.*

1. **Milestone Checkbox Celebrations:**
   * Trigger a target confetti splash when a user checks off all tasks inside a weekly study module using `canvas-confetti`.
2. **Roadmap Progress Rings:**
   * Add a SVG circle-stroke animation representing percentage of completed study modules (`stroke-dashoffset` calculated dynamically based on checked items).

---

## ⚡ Integration Guide: Frontend-to-Backend API Mappings

### 1. Resume Analyze Action
* **Trigger:** Click "Analyze Resume"
* **Payload Format:** `FormData` containing `file` and optional `jobDescription`.
* **API Route:** `POST /api/resume/analyze`
* **Handling:** Store the returned `resumeId` and `reportId` in React Context/State.

### 2. Roadmap Generation Action
* **Trigger:** Select target role & study hours, click "Generate Roadmap"
* **Payload Format:** JSON
  ```json
  {
    "resumeId": "ids.resumeId",
    "resumeSkills": ["skill1", "skill2"],
    "targetRole": "backend-engineer",
    "availableHoursPerDay": 3
  }
  ```
* **API Route:** `POST /api/planner/roadmap`
* **Handling:** Render the returned week modules on the Timeline component.
