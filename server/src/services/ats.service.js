// Deterministic, rule-based ATS scoring. LLM is used only upstream for extraction -
// scoring stays plain code so it's consistent, cheap, and unit-testable.

function computeAtsScore(rawText, structuredResume, jobDescription) {
  const checks = [];
  let score = 0;
  const maxScore = 100;

  // 1. Contact info present (10 pts)
  const hasEmail = !!structuredResume.email;
  const hasPhone = !!structuredResume.phone;
  const contactScore = (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0);
  checks.push({
    name: 'Contact info (email + phone)',
    passed: hasEmail && hasPhone,
    points: contactScore,
    detail: `${hasEmail ? 'Email' : 'No email'} & ${hasPhone ? 'phone' : 'no phone'} found`,
  });
  score += contactScore;

  // 2. Core sections present (20 pts)
  const hasExperience = (structuredResume.experience || []).length > 0;
  const skillsCount = (structuredResume.skills || []).length;
  const skillsScore = Math.min(10, Math.round((skillsCount / 5) * 10));
  checks.push({ name: 'Experience section present', passed: hasExperience, points: hasExperience ? 10 : 0 });
  checks.push({
    name: 'Skills section (5+) present',
    passed: skillsCount >= 5,
    points: skillsScore,
    detail: `${skillsCount} skill(s) listed (optimal is 5+)`,
  });
  if (hasExperience) score += 10;
  score += skillsScore;

  // 3. Education present (5 pts)
  const hasEducation = (structuredResume.education || []).length > 0;
  checks.push({ name: 'Education section present', passed: hasEducation, points: hasEducation ? 5 : 0 });
  if (hasEducation) score += 5;

  // 4. Quantified achievements - bullets containing numbers/% (15 pts)
  const allBullets = (structuredResume.experience || []).flatMap((e) => e.bulletPoints || []);
  const quantifiedBullets = allBullets.filter((b) => /\d/.test(b));
  const quantifiedRatio = allBullets.length ? quantifiedBullets.length / allBullets.length : 0;
  const quantifiedScore = allBullets.length
    ? Math.round(Math.min(1, quantifiedRatio / 0.4) * 15)
    : 0;
  checks.push({
    name: 'Quantified achievements (40%+ bullets with numbers)',
    passed: quantifiedRatio >= 0.4,
    points: quantifiedScore,
    detail: `${quantifiedBullets.length}/${allBullets.length} bullets contain numbers (${Math.round(quantifiedRatio * 100)}% of total)`,
  });
  score += quantifiedScore;

  // 5. Resume length sanity check via word count (10 pts)
  const wordCount = rawText.trim().split(/\s+/).length;
  const lengthOk = wordCount >= 250 && wordCount <= 1100;
  let lengthScore = 10;
  if (!lengthOk) {
    if (wordCount < 250) {
      lengthScore = Math.max(0, Math.round((wordCount / 250) * 10));
    } else {
      lengthScore = Math.max(0, Math.round((1 - (wordCount - 1100) / 1000) * 10));
    }
  }
  checks.push({
    name: 'Resume length (250-1100 words)',
    passed: lengthOk,
    points: lengthScore,
    detail: `${wordCount} words`,
  });
  score += lengthScore;

  // 6. Formatting noise proxy - real ATS systems choke on tables/columns/icons.
  const specialCharRatio = rawText.length ? (rawText.match(/[^\w\s.,;:()\-/]/g) || []).length / rawText.length : 0;
  const formattingOk = specialCharRatio < 0.03;
  const formattingScore = Math.max(0, Math.round((1 - specialCharRatio / 0.1) * 10));
  checks.push({
    name: 'Clean formatting (low special-character noise)',
    passed: formattingOk,
    points: formattingScore,
    detail: `${Math.round(specialCharRatio * 1000) / 10}% special characters`,
  });
  score += formattingScore;

  // 7. Keyword overlap with job description (20 pts) - only if JD provided
  let keywordOverlap = null;
  if (jobDescription && jobDescription.trim().length > 20) {
    keywordOverlap = computeKeywordOverlap(structuredResume.skills || [], jobDescription);
    const overlapScore = Math.round((keywordOverlap.overlapPercent / 100) * 20);
    checks.push({
      name: 'Job description keyword overlap (50%+)',
      passed: keywordOverlap.overlapPercent >= 50,
      points: overlapScore,
      detail: `${keywordOverlap.overlapPercent}% overlap`,
    });
    score += overlapScore;
  }

  // Ensure score stays bounded
  score = Math.max(0, Math.min(maxScore, score));

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
