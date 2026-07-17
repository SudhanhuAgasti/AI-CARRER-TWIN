// Deterministic, rule-based ATS scoring. LLM is used only upstream for extraction -
// scoring stays plain code so it's consistent, cheap, and unit-testable.

const COMMON_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'golang', 'rust', 'php', 'swift', 'kotlin', 'html', 'css', 'sql', 'nosql',
  'react', 'angular', 'vue', 'next.js', 'nextjs', 'express', 'django', 'flask', 'spring boot', 'laravel', 'asp.net', 'nestjs', 'tailwind', 'bootstrap', 'redux',
  'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'dynamodb', 'firebase',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'terraform', 'jenkins', 'git', 'github',
  'rest api', 'restful', 'graphql', 'microservices', 'system design', 'agile', 'scrum', 'machine learning', 'deep learning', 'ai', 'nlp', 'data science', 'unit testing'
];

function computeAtsScore(rawText, structuredResume, jobDescription) {
  const checks = [];
  let score = 0;
  let maxPossiblePoints = 0;

  // 1. Contact info present (10 pts max)
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
  maxPossiblePoints += 10;

  // 2. Core sections present (20 pts max)
  const hasExperience = (structuredResume.experience || []).length > 0;
  const skillsCount = (structuredResume.skills || []).length;
  const skillsScore = Math.min(10, Math.round((skillsCount / 5) * 10));
  checks.push({
    name: 'Experience section present',
    passed: hasExperience,
    points: hasExperience ? 10 : 0,
    detail: hasExperience ? 'Experience section found' : 'No experience section found'
  });
  checks.push({
    name: 'Skills section (5+) present',
    passed: skillsCount >= 5,
    points: skillsScore,
    detail: `${skillsCount} skill(s) listed (optimal is 5+)`,
  });
  if (hasExperience) score += 10;
  score += skillsScore;
  maxPossiblePoints += 20;

  // 3. Education present (5 pts max)
  const hasEducation = (structuredResume.education || []).length > 0;
  checks.push({
    name: 'Education section present',
    passed: hasEducation,
    points: hasEducation ? 5 : 0,
    detail: hasEducation ? 'Education section found' : 'No education section found'
  });
  if (hasEducation) score += 5;
  maxPossiblePoints += 5;

  // 4. Quantified achievements - bullets containing numbers/% (15 pts max)
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
  maxPossiblePoints += 15;

  // 5. Resume length sanity check via word count (10 pts max)
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
  maxPossiblePoints += 10;

  // 6. Formatting noise proxy - real ATS systems choke on tables/columns/icons (10 pts max)
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
  maxPossiblePoints += 10;

  // 7. Keyword overlap with job description (20 pts max) - only if JD provided
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
    maxPossiblePoints += 20;
  }

  // Calculate final normalized score out of 100
  const normalizedScore = maxPossiblePoints > 0 ? Math.round((score / maxPossiblePoints) * 100) : 0;

  return {
    score: normalizedScore,
    maxScore: 100,
    grade: normalizedScore >= 80 ? 'A' : normalizedScore >= 60 ? 'B' : normalizedScore >= 40 ? 'C' : 'D',
    checks,
    keywordOverlap,
  };
}

function computeKeywordOverlap(resumeSkills, jobDescription) {
  const normalize = (s) => s.toLowerCase().trim();
  
  // Normalize resume skills
  const normalizedResumeSkills = resumeSkills.map(normalize).filter(Boolean);
  const resumeSkillsSet = new Set(normalizedResumeSkills);

  // Helper to escape regex
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Helper to check if a skill exists in text
  const isSkillInText = (skill, text) => {
    const escaped = escapeRegExp(skill);
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9])` + escaped + `(?:$|[^a-zA-Z0-9])`, 'i');
    return regex.test(text);
  };

  // Find which skills are in the job description
  const jdSkills = new Set();

  // 1. Add any skill from resumeSkills that is found in the JD
  for (const skill of normalizedResumeSkills) {
    if (isSkillInText(skill, jobDescription)) {
      jdSkills.add(skill);
    }
  }

  // 2. Add common skills that are found in the JD
  for (const skill of COMMON_SKILLS) {
    if (isSkillInText(skill, jobDescription)) {
      jdSkills.add(skill);
    }
  }

  // Now, matched keywords are those in jdSkills that are also in the resume skills
  const matched = [];
  const missing = [];

  for (const skill of jdSkills) {
    if (resumeSkillsSet.has(skill)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  const totalJdSkills = jdSkills.size;
  const overlapPercent = totalJdSkills
    ? Math.round((matched.length / totalJdSkills) * 100)
    : 100; // If JD has no identifiable skills, overlap is 100%

  return {
    matchedKeywords: matched.map(s => {
      const original = resumeSkills.find(rs => rs.toLowerCase() === s) || 
                       COMMON_SKILLS.find(cs => cs.toLowerCase() === s) || 
                       s;
      return original;
    }),
    missingKeywords: missing.map(s => {
      const original = COMMON_SKILLS.find(cs => cs.toLowerCase() === s) || s;
      return original;
    }),
    overlapPercent: Math.min(overlapPercent, 100),
  };
}

module.exports = { computeAtsScore };
