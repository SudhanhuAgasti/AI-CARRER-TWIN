# AI Career Twin — Phase 1: Resume + ATS Analyzer

Backend service that parses a resume (PDF/DOCX), extracts structured data via
OpenAI structured outputs, and computes two independent scores:

1. **ATS score** — deterministic, rule-based (no LLM). Checks structure,
   formatting, quantified achievements, keyword overlap.
2. **Match score** — embeddings-based semantic similarity vs a job description
   (optional, only runs if `jobDescription` is provided).

## Why ATS scoring is rule-based, not LLM-based

LLMs are inconsistent and expensive to run at scale for scoring. Real ATS
systems (Workday, Greenhouse, Taleo) use deterministic parsing rules — this
mirrors that. The LLM is used only for *extraction* (turning unstructured
text into structured JSON); the scoring logic is plain JavaScript you can
read, tune, and unit test without touching an API key.

## Setup

```bash
cd ai-career-twin
npm install
cp .env.example .env
# add your OPENAI_API_KEY in .env
npm run dev
```

Server starts on `http://localhost:4000` (configurable via `PORT` in `.env`).

## API

**POST** `/api/resume/analyze`
Content-Type: `multipart/form-data`

| Field | Required | Description |
|---|---|---|
| `file` | yes | Resume file, PDF or DOCX, max 5MB |
| `jobDescription` | no | Plain text job description for match scoring |

Example:

```bash
curl -X POST http://localhost:4000/api/resume/analyze \
  -F "file=@resume.pdf" \
  -F "jobDescription=Looking for a Node.js backend engineer with AWS and PostgreSQL experience"
```

Response shape:

```json
{
  "structuredResume": {
    "name": "...", "email": "...", "phone": "...",
    "skills": ["..."], "experience": [{ "title": "...", "company": "...", "bulletPoints": ["..."] }],
    "education": [{ "degree": "...", "institution": "..." }]
  },
  "ats": {
    "score": 75, "maxScore": 100, "grade": "B",
    "checks": [{ "name": "...", "passed": true, "points": 10 }]
  },
  "match": { "similarityScore": 82, "interpretation": "Strong match" }
}
```

## What's intentionally simple right now (and why)

- **Keyword overlap is word-level, not skill-taxonomy-based.** Swap for a real
  skills ontology (ESCO, O*NET, or LinkedIn Skills API) before relying on this
  for production scoring — word overlap misses synonyms (`JS` vs `JavaScript`)
  and over-counts noise words.
- **No persistence yet.** PostgreSQL schema comes in Phase 1.5, once this
  pipeline's output shape is validated against real resumes.
- **No auth or rate-limiting.** Add both before any public deployment —
  resume uploads + OpenAI calls are exactly the kind of endpoint that gets
  abused if left open.
- **No OCR.** Scanned/image-based PDFs will extract empty or garbled text —
  flag this case to the user rather than silently failing.

## Next phase

Phase 2 (skill-gap + roadmap generation) consumes `structuredResume` as its
input contract. Don't change this JSON shape without updating Phase 2 too.
