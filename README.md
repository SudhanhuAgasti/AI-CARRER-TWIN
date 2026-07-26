# AI Career Twin

An enterprise-grade, AI-driven career advisor and preparation platform. The application parses candidate resumes, computes ATS scores, profiles GitHub and LinkedIn repositories, generates dynamic study roadmaps, hosts real-time AI mock interviews with speech analytics, and provides an isolated sandboxed coding workspace.

---

## 🚀 Key Features

### 1. Resume Parser & ATS Scorer
- **Text Extraction & OCR:** Extracts content from PDF, DOCX, PNG, and JPEG files using native text extraction and Tesseract OCR.
- **Structured AI Profiling:** Leverages Gemini AI to build a structured profile (experience, education, skills, certifications).
- **Ats Scoring Engine:** Combines deterministic checks (formatting, sections, contact info) with semantic embedding-based matching.

### 2. GitHub & LinkedIn Profiler
- **Portfolio Analyzer:** Pulls user-specific stats, repo summaries, and evaluates codebase metrics (heuristics).
- **Optimization Strategy:** Suggests profile updates, keyword additions, and layout corrections to attract recruiters.

### 3. AI Mock Interviewer & Telemetry
- **Concurrent Session Locks:** Prevents multi-tab interview spam via atomic Mongo session flags.
- **Speech Analytics:** Records, transcribes, and analyzes candidate audio telemetry to rate answer confidence and pace.

### 4. Code Sandbox Compiler
- **Isolated Workspace:** Secure sandboxed code runner allowing candidates to execute live programming challenges.

### 5. Custom Secure Authentication & Authorization
- **Token Rotation Pattern:** Separates concerns into distinct authentication and authorization middleware layers.
- **XSS & CSRF Mitigation:** Stores short-lived JWT access tokens in client memory and rotates long-lived session refresh tokens inside secure `HttpOnly`, `SameSite: Strict` cookies.
- **Zustand Token Isolation:** Preserves user profile context locally while omitting access tokens from persistent storage.

---

## 🛠️ Architecture & Folder Structure

```
├── client/                     # Frontend Application (React + TypeScript + Vite)
│   ├── src/
│   │   ├── api/                # Axios instance & token refresh interceptors
│   │   ├── components/         # Reusable UI & protected route guards
│   │   ├── features/           # Feature pages (Auth, Resume, Interview, Dashboard)
│   │   └── store/              # Zustand global state (Auth, UI)
│   └── package.json
│
├── server/                     # Backend Application (Node.js + Express + Mongoose)
│   ├── src/
│   │   ├── config/             # DB, Gemini, and general config validation (Zod)
│   │   ├── controllers/        # Express handlers (Auth, Resume, Telemetry)
│   │   ├── middleware/         # Custom middlewares (Rate limit, Auth/Authz folders)
│   │   ├── models/             # Mongoose schemas (User, Resume, InterviewSession)
│   │   └── routes/             # REST route mapping
│   └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local instance running on port `27017` or MongoDB Atlas URI)

### Setup Environment Variables

#### Server (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/ai-career-twin
GEMINI_API_KEY=your_gemini_api_key
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
```

#### Client (`client/.env`)
Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:4000
```

---

## 🏃 Running the Application

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
```

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
