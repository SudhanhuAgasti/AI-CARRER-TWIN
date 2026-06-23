// Deterministic, rule-based ATS scoring. LLM is used only upstream for extraction -
// scoring stays plain code so it's consistent, cheap, and unit-testable.

function computeAtsScore(rawText, structuredResume, jobDescription) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // 1. Contact info present (10 pts)
  const hasEmail = !!structuredResume.email;
  const hasPhone = !!structuredResume.phone;
  const contactOk = hasEmail && hasPhone;
  checks.push({ name: 'Contact info (email + phone)', passed: contactOk, points: 10 });
  if (contactOk) score += 10;

  // 2. Core sections present (20 pts)
  const hasExperience = (structuredResume.experience || []).length > 0;
  const hasSkills = (structuredResume.skills || []).length >= 5;
  checks.push({ name: 'Experience section present', passed: hasExperience, points: 10 });
  checks.push({ name: 'Skills section (5+) present', passed: hasSkills, points: 10 });
  if (hasExperience) score += 10;
  if (hasSkills) score += 10;

  // 3. Education present (5 pts)
  const hasEducation = (structuredResume.education || []).length > 0;
  checks.push({ name: 'Education section present', passed: hasEducation, points: 5 });
  if (hasEducation) score += 5;

  // 4. Quantified achievements - bullets containing numbers/% (15 pts)
  const allBullets = (structuredResume.experience || []).flatMap((e) => e.bulletPoints || []);
  const quantifiedBullets = allBullets.filter((b) => /\d/.test(b));
  const quantifiedRatio = allBullets.length ? quantifiedBullets.length / allBullets.length : 0;
  const quantifiedPassed = quantifiedRatio >= 0.4;
  checks.push({
    name: 'Quantified achievements (40%+ bullets with numbers)',
    passed: quantifiedPassed,
    points: 15,
    detail: `${quantifiedBullets.length}/${allBullets.length} bullets contain numbers`,
  });
  if (quantifiedPassed) score += 15;

  // 5. Resume length sanity check via word count (10 pts)
  const wordCount = rawText.trim().split(/\s+/).length;
  const lengthOk = wordCount >= 250 && wordCount <= 1100;
  checks.push({
    name: 'Resume length (250-1100 words)',
    passed: lengthOk,
    points: 10,
    detail: `${wordCount} words`,
  });
  if (lengthOk) score += 10;

  // 6. Formatting noise proxy - real ATS systems choke on tables/columns/icons.
  // We can't detect layout from plain text, so this is a rough stand-in:
  // high ratio of non-standard characters often correlates with icon bullets,
  // pipe-separated tables, or special glyphs that break parsers.
  const specialCharRatio = (rawText.match(/[^\w\s.,;:()\-/]/g) || []).length / rawText.length;
  const formattingOk = specialCharRatio < 0.03;
  checks.push({
    name: 'Clean formatting (low special-character noise)',
    passed: formattingOk,
    points: 10,
  });
  if (formattingOk) score += 10;

  // 7. Keyword overlap with job description (20 pts) - only if JD provided
  let keywordOverlap = null;
  if (jobDescription && jobDescription.trim().length > 20) {
    keywordOverlap = computeKeywordOverlap(structuredResume.skills || [], jobDescription);
    const overlapPassed = keywordOverlap.overlapPercent >= 50;
    checks.push({
      name: 'Job description keyword overlap (50%+)',
      passed: overlapPassed,
      points: 20,
      detail: `${keywordOverlap.overlapPercent}% overlap`,
    });
    if (overlapPassed) score += 20;
  }

  return {
    score,
    maxScore,
    grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
    checks,
    keywordOverlap,
  };
}

// NOTE: this is word-level overlap, not a real skills taxonomy match.
// Swap for ESCO / O*NET / a curated skills ontology before relying on this in production -
// word overlap will both miss synonyms ("JS" vs "JavaScript") and over-count noise words.
function computeKeywordOverlap(resumeSkills, jobDescription) {
  const normalize = (s) => s.toLowerCase().trim();
  const resumeSet = new Set(resumeSkills.map(normalize));

  const jdWords = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const jdKeywordSet = new Set(jdWords);
  const matched = [...jdKeywordSet].filter((w) => resumeSet.has(w));

  const overlapPercent = jdKeywordSet.size
    ? Math.round((matched.length / jdKeywordSet.size) * 100)
    : 0;

  return {
    matchedKeywords: matched,
    overlapPercent: Math.min(overlapPercent, 100),
  };
}

module.exports = { computeAtsScore };
