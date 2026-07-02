export interface CvParseResult {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    startYear: string;
    endYear: string;
  }[];
  certifications: string[];
  totalExperienceYears: number;
  currentCompany: string;
  currentPosition: string;
  linkedInUrl: string;
}

export interface MetricScore {
  metricId: number;
  name: string;
  category: string;
  score: number;
  maxScore: number;
  weight: number;
  reasoning: string;
}

const DEFAULT_METRICS = [
  {
    id: 1, name: "Experience Match", category: "experience",
    maxScore: 10, weight: 25,
    description: "Relevance and depth of professional experience",
  },
  {
    id: 2, name: "Education", category: "education",
    maxScore: 10, weight: 10,
    description: "Educational qualifications and field of study",
  },
  {
    id: 3, name: "Skills Alignment", category: "skills",
    maxScore: 10, weight: 30,
    description: "Matching of listed skills against job requirements",
  },
  {
    id: 4, name: "Certifications", category: "certification",
    maxScore: 10, weight: 5,
    description: "Relevant professional certifications",
  },
  {
    id: 5, name: "Job Stability", category: "stability",
    maxScore: 10, weight: 5,
    description: "Average tenure across previous roles",
  },
  {
    id: 6, name: "Communication", category: "communication",
    maxScore: 10, weight: 10,
    description: "Quality of CV writing and articulation",
  },
  {
    id: 7, name: "Leadership Potential", category: "leadership",
    maxScore: 10, weight: 10,
    description: "Leadership roles, team management, initiative",
  },
  {
    id: 8, name: "Cultural Fit Indicators", category: "cultural",
    maxScore: 10, weight: 5,
    description: "Values alignment, volunteer work, community involvement",
  },
];

export function getDefaultMetrics() {
  return DEFAULT_METRICS;
}

export function calculateOverallScore(scores: MetricScore[]): number {
  const totalWeight = scores.reduce((s, m) => s + m.weight, 0);
  if (totalWeight === 0) return 0;
  const weighted = scores.reduce((s, m) => s + (m.score / m.maxScore) * m.weight, 0);
  return Math.round((weighted / totalWeight) * 100);
}

export function extractEmail(text: string): string {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0] : "";
}

export function extractPhone(text: string): string {
  const match = text.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  );
  return match ? match[0].trim() : "";
}

export function extractLinkedIn(text: string): string {
  const match = text.match(
    /https?:\/\/(?:www\.)?linkedin\.com\/[a-zA-Z0-9_-]+\/?/
  );
  return match ? match[0] : "";
}

export function extractSkills(text: string): string[] {
  const skillKeywords = [
    "javascript", "typescript", "python", "java", "go", "rust", "c++", "c#",
    "react", "angular", "vue", "node", "express", "django", "flask", "spring",
    "sql", "postgresql", "mysql", "mongodb", "redis", "docker", "kubernetes",
    "aws", "gcp", "azure", "git", "ci/cd", "agile", "scrum", "rest", "graphql",
    "machine learning", "data science", "ai", "blockchain", "devops",
    "project management", "leadership", "communication", "sales", "marketing",
    "excel", "powerpoint", "word", "tableau", "power bi", "figma", "sketch",
    "adobe", "photoshop", "illustrator", "ui/ux", "product management",
    "accounting", "finance", "hr", "recruiting", "public speaking",
    "negotiation", "critical thinking", "problem solving", "teamwork",
    "time management", "analytical", "research", "writing", "editing",
    "content creation", "seo", "sem", "social media", "customer service",
    "business development", "strategy", "operations", "supply chain",
    "logistics", "quality assurance", "testing", "security", "networking",
    "linux", "windows", "macos", "mobile", "ios", "android", "swift",
    "kotlin", "ruby", "php", "scala", "haskell", "matlab", "r", "sas",
    "spss", "sap", "oracle", "salesforce", "hubspot", "zendesk",
    "jira", "confluence", "notion", "slack", "trello", "asana", "monday",
    "data analysis", "data engineering", "data modeling", "etl",
    "big data", "hadoop", "spark", "kafka", "terraform", "ansible",
    "jenkins", "github actions", "gitlab", "bitbucket",
  ];

  const lower = text.toLowerCase();
  const found = skillKeywords.filter((sk) => lower.includes(sk));
  return [...new Set(found)];
}

export function extractExperienceYears(text: string): number {
  const yearPatterns = [
    ...text.matchAll(/(\d+)\+?\s*years?\s*(?:of)?\s*experience/gi),
    ...text.matchAll(/(\d+)\+?\s*years?\s*(?:of)?\s*(?:professional|work|industry)\s*experience/gi),
  ];
  for (const m of yearPatterns) {
    const years = parseInt(m[1]);
    if (years > 0 && years < 60) return years;
  }
  const dateRanges = text.matchAll(
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*(\d{4})\s*(?:-|–|to)\s*(Present|Current|Now|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4})/gi
  );
  let totalYears = 0;
  for (const m of dateRanges) {
    const endStr = m[3]?.toLowerCase() || "";
    if (endStr === "present" || endStr === "current" || endStr === "now") {
      totalYears += new Date().getFullYear() - parseInt(m[2]);
    } else {
      const endMatch = endStr.match(/\d{4}/);
      if (endMatch) {
        totalYears += parseInt(endMatch[0]) - parseInt(m[2]);
      }
    }
  }
  return totalYears || 0;
}

export function extractCurrentPosition(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if (
      lower.includes("current") || lower.includes("present") ||
      (lower.includes("experience") && i < 3)
    ) {
      const next = lines[i + 1] || lines[i];
      if (next.length > 2 && next.length < 150) return next;
    }
  }
  return "";
}

export function extractCurrentCompany(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if (lower.includes("current") || lower.includes("present")) {
      const next = lines[i + 1] || lines[i];
      const after = lines[i + 2] || "";
      const company = next.length > 2 && next.length < 100 ? next : after;
      return company || "";
    }
  }
  return "";
}

export function extractCertifications(text: string): string[] {
  const certKeywords = [
    "pmp", "prince2", "scrum master", "csm", "psm", "cissp", "ceh",
    "aws certified", "azure certified", "gcp certified", "cka", "ckad",
    "cfa", "cpa", "acca", "cia", "cma", "six sigma", "lean",
    "itil", "comptia", "ccna", "ccnp", "mcse", "ocp", "ocjp",
    "toefl", "ielts", "gmat", "gre", "cfe", "cams", "crcm",
    "shrm", "phr", "sphr", "ccp", "cebs",
    "google analytics", "google ads", "hubspot", "salesforce admin",
  ];

  const lower = text.toLowerCase();
  const certs: string[] = [];
  const sentences = text.split(/[.\n]+/);
  for (const sentence of sentences) {
    const matched = certKeywords.find((ck) => lower.includes(ck));
    if (matched && !certs.includes(matched)) {
      const formatted = matched.replace(/\b\w/g, (c) => c.toUpperCase());
      certs.push(formatted);
    }
  }
  return certs;
}

export function parseCV(text: string): CvParseResult {
  const email = extractEmail(text);
  const phone = extractPhone(text);
  const linkedInUrl = extractLinkedIn(text);
  const skills = extractSkills(text);
  const totalExperienceYears = extractExperienceYears(text);
  const currentCompany = extractCurrentCompany(text);
  const currentPosition = extractCurrentPosition(text);
  const certifications = extractCertifications(text);

  const nameMatch = text.match(
    /^([A-Z][a-z]+)\s+([A-Z][a-z]+)/m
  );
  const firstName = nameMatch ? nameMatch[1] : "";
  const lastName = nameMatch ? nameMatch[2] : "";

  const firstLines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 5);

  const summary = firstLines
    .filter((l) => l.length > 20 && !l.includes("@") && !l.includes("http"))
    .slice(0, 2)
    .join(" ")
    .slice(0, 500);

  return {
    firstName,
    lastName,
    email,
    phone,
    summary,
    skills,
    experience: [],
    education: [],
    certifications,
    totalExperienceYears,
    currentCompany,
    currentPosition,
    linkedInUrl,
  };
}

export function scoreCV(
  cv: CvParseResult,
  jobRequirements: {
    requiredSkills?: string[];
    preferredSkills?: string[];
    minExperience?: number;
    educationField?: string;
  },
  metrics: { id: number; name: string; category: string; maxScore: number; weight: number; config?: any }[],
  jobDescription?: string
): MetricScore[] {
  return metrics.map((metric) => {
    let score = 0;
    let reasoning = "";

    switch (metric.category) {
      case "experience": {
        const minExp = jobRequirements.minExperience || 0;
        const years = cv.totalExperienceYears;
        if (years >= minExp + 3) { score = metric.maxScore; reasoning = `${years} years exceeds ${minExp}+ requirement`; }
        else if (years >= minExp + 1) { score = Math.round(metric.maxScore * 0.8); reasoning = `${years} years meets requirement`; }
        else if (years >= minExp) { score = Math.round(metric.maxScore * 0.6); reasoning = `${years} years meets minimum`; }
        else if (years >= minExp - 1) { score = Math.round(metric.maxScore * 0.4); reasoning = `${years} years slightly below ${minExp}+`; }
        else { score = Math.round(metric.maxScore * 0.2); reasoning = `${years} years below required ${minExp}+`; }
        break;
      }
      case "education": {
        const eduText = JSON.stringify(cv.education).toLowerCase();
        const degreeKeywords = ["bachelor", "master", "phd", "doctorate", "b.sc", "m.sc", "b.a", "m.a", "b.eng", "m.eng", "b.tech", "m.tech", "hnd", "ond", "diploma"];
        const matchedDegrees = degreeKeywords.filter((d) => eduText.includes(d));
        if (matchedDegrees.length > 0) {
          const highest = ["phd", "doctorate", "master", "m.sc", "m.a", "m.eng", "m.tech", "bachelor", "b.sc", "b.a", "b.eng", "b.tech", "hnd", "ond", "diploma"];
          const idx = highest.findIndex((h) => matchedDegrees.some((md) => md.includes(h)));
          const rank = idx >= 0 ? highest.length - idx : 0;
          score = Math.round((metric.maxScore * rank) / highest.length);
        }
        const field = jobRequirements.educationField?.toLowerCase();
        if (field && eduText.includes(field)) {
          score = Math.min(metric.maxScore, score + Math.round(metric.maxScore * 0.2));
        }
        if (score === 0 && eduText.length > 0) score = Math.round(metric.maxScore * 0.3);
        reasoning = score > 0 ? `Education matched` : "No education data found";
        break;
      }
      case "skills": {
        const required = jobRequirements.requiredSkills || [];
        const preferred = jobRequirements.preferredSkills || [];
        if (required.length === 0) {
          score = cv.skills.length > 0 ? Math.round(metric.maxScore * 0.6) : 0;
          reasoning = `${cv.skills.length} skills identified`;
        } else {
          const matched = required.filter((s) =>
            cv.skills.some((cs) => cs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cs.toLowerCase()))
          );
          const preferredMatched = preferred.filter((s) =>
            cv.skills.some((cs) => cs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cs.toLowerCase()))
          );
          const matchRate = matched.length / required.length;
          score = Math.round(metric.maxScore * matchRate);
          const bonus = Math.round((metric.maxScore * preferredMatched.length) / (preferred.length || 1) * 0.2);
          score = Math.min(metric.maxScore, score + bonus);
          reasoning = `${matched.length}/${required.length} required skills matched`;
        }
        break;
      }
      case "certification": {
        const count = cv.certifications.length;
        score = count >= 3 ? metric.maxScore : count >= 2 ? Math.round(metric.maxScore * 0.7) : count >= 1 ? Math.round(metric.maxScore * 0.4) : 0;
        reasoning = `${count} certifications found`;
        break;
      }
      case "stability": {
        const years = cv.totalExperienceYears;
        if (years >= 10) { score = metric.maxScore; reasoning = "Long tenure history"; }
        else if (years >= 5) { score = Math.round(metric.maxScore * 0.7); reasoning = "Moderate tenure"; }
        else { score = Math.round(metric.maxScore * 0.4); reasoning = "Early career"; }
        break;
      }
      case "communication": {
        const len = cv.summary.length;
        const hasGrammar = !/(?:\bteh\b|\bthier\b|\brecieve\b|\bacommodate\b)/i.test(cv.summary);
        if (len > 200 && hasGrammar) { score = metric.maxScore; reasoning = "Well-articulated CV"; }
        else if (len > 100) { score = Math.round(metric.maxScore * 0.7); reasoning = "Adequate articulation"; }
        else { score = Math.round(metric.maxScore * 0.4); reasoning = "Minimal content"; }
        break;
      }
      case "leadership": {
        const lower = JSON.stringify(cv).toLowerCase();
        const leadKeywords = ["lead", "manager", "head", "director", "supervisor", "team lead", "managed", "led", "oversaw", "principal"];
        const matched = leadKeywords.filter((k) => lower.includes(k));
        score = matched.length >= 3 ? metric.maxScore : matched.length >= 2 ? Math.round(metric.maxScore * 0.7) : matched.length >= 1 ? Math.round(metric.maxScore * 0.4) : Math.round(metric.maxScore * 0.2);
        reasoning = matched.length > 0 ? `${matched.length} leadership indicators found` : "No leadership indicators";
        break;
      }
      case "cultural": {
        const lower = JSON.stringify(cv).toLowerCase();
        const culturalKeywords = ["volunteer", "mentor", "community", "nonprofit", "diversity", "inclusion", "team building", "cross-functional", "collaboration"];
        const matched = culturalKeywords.filter((k) => lower.includes(k));
        score = matched.length >= 3 ? metric.maxScore : matched.length >= 2 ? Math.round(metric.maxScore * 0.7) : matched.length >= 1 ? Math.round(metric.maxScore * 0.4) : Math.round(metric.maxScore * 0.2);
        reasoning = matched.length > 0 ? `${matched.length} cultural indicators found` : "No cultural indicators";
        break;
      }
      default:
        score = Math.round(metric.maxScore * 0.5);
        reasoning = "Custom metric";
    }

    return {
      metricId: metric.id,
      name: metric.name,
      category: metric.category,
      score: Math.min(score, metric.maxScore),
      maxScore: metric.maxScore,
      weight: metric.weight,
      reasoning,
    };
  });
}
