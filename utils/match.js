/**
 * 简历与职位的匹配算法
 * 从多个维度计算匹配度得分
 */

function calculateMatch(resume, job) {
  if (!resume || !job) return { total: 0, details: {} };

  const resumeSkills = (resume.skills || []).map(s => s.toLowerCase());
  const jobRequirements = (job.requirements || []).map(r => r.toLowerCase());
  const resumeRoles = (resume.targetRoles || []).map(r => r.toLowerCase());
  const resumeCities = (resume.targetCities || []).map(c => c.toLowerCase());

  // 1. 技能匹配度 (40%)
  const skillScore = calculateSkillMatch(resumeSkills, jobRequirements);

  // 2. 职位标题匹配 (20%)
  const titleScore = calculateTitleMatch(resumeRoles, resume.title, job.title);

  // 3. 薪资匹配 (15%)
  const salaryScore = calculateSalaryMatch(resume.targetSalary, job);

  // 4. 地点匹配 (15%)
  const locationScore = calculateLocationMatch(resumeCities, job.location);

  // 5. JD关键词匹配 (10%)
  const keywordScore = calculateKeywordMatch(resume, job.jd);

  const total = Math.round(
    skillScore * 0.40 +
    titleScore * 0.20 +
    salaryScore * 0.15 +
    locationScore * 0.15 +
    keywordScore * 0.10
  );

  return {
    total,
    details: {
      skill: { score: skillScore, weight: 40, label: '技能匹配' },
      title: { score: titleScore, weight: 20, label: '职位匹配' },
      salary: { score: salaryScore, weight: 15, label: '薪资匹配' },
      location: { score: locationScore, weight: 15, label: '地点匹配' },
      keyword: { score: keywordScore, weight: 10, label: '关键词匹配' }
    },
    matchedSkills: getMatchedSkills(resumeSkills, jobRequirements),
    missingSkills: getMissingSkills(resumeSkills, jobRequirements)
  };
}

function calculateSkillMatch(resumeSkills, jobRequirements) {
  if (!jobRequirements.length) return 100;
  if (!resumeSkills.length) return 0;

  let matched = 0;
  jobRequirements.forEach(req => {
    if (resumeSkills.some(skill => skill.includes(req) || req.includes(skill))) {
      matched++;
    }
  });

  return Math.round((matched / jobRequirements.length) * 100);
}

function calculateTitleMatch(targetRoles, resumeTitle, jobTitle) {
  const jobTitleLower = (jobTitle || '').toLowerCase();
  if (!jobTitleLower) return 50;

  const allTitles = [...targetRoles];
  if (resumeTitle) allTitles.push(resumeTitle.toLowerCase());

  for (const role of allTitles) {
    if (jobTitleLower.includes(role) || role.includes(jobTitleLower)) {
      return 100;
    }
    // 部分匹配
    const jobWords = jobTitleLower.split(/[\s\/\-_]+/);
    const roleWords = role.split(/[\s\/\-_]+/);
    const common = jobWords.filter(w => roleWords.includes(w) && w.length > 1);
    if (common.length >= 2) return 80;
    if (common.length === 1) return 60;
  }

  return 30;
}

function calculateSalaryMatch(targetSalary, job) {
  if (!targetSalary || !job.salaryMin) return 50;

  const min = targetSalary.min || 0;
  const max = targetSalary.max || 999;
  const jobMin = job.salaryMin || 0;
  const jobMax = job.salaryMax || jobMin;

  // 期望薪资区间与职位薪资区间重叠度
  const overlapMin = Math.max(min, jobMin);
  const overlapMax = Math.min(max, jobMax);

  if (overlapMax >= overlapMin) {
    // 有重叠
    const overlapRange = overlapMax - overlapMin;
    const totalRange = Math.max(max, jobMax) - Math.min(min, jobMin);
    return Math.min(100, Math.round(70 + (overlapRange / totalRange) * 30));
  }

  // 无重叠
  const gap = overlapMin - overlapMax;
  const baseGap = Math.max(max, jobMax) * 0.2;
  if (gap <= baseGap) return 50;
  if (gap <= baseGap * 2) return 30;
  return 10;
}

function calculateLocationMatch(targetCities, jobLocation) {
  if (!targetCities.length) return 50;
  if (!jobLocation) return 50;

  const loc = jobLocation.toLowerCase();
  for (const city of targetCities) {
    if (loc.includes(city) || city.includes(loc)) {
      return 100;
    }
  }

  // 一线/新一线城市间的模糊匹配
  const tier1 = ['北京', '上海', '广州', '深圳'];
  const newTier1 = ['杭州', '成都', '武汉', '西安', '南京', '苏州', '郑州', '长沙'];

  const jobTier = tier1.find(c => loc.includes(c)) ? 1 :
                  newTier1.find(c => loc.includes(c)) ? 2 : 3;
  for (const city of targetCities) {
    const targetTier = tier1.find(c => city.includes(c)) ? 1 :
                       newTier1.find(c => city.includes(c)) ? 2 : 3;
    if (jobTier === targetTier && jobTier <= 2) return 60;
  }

  return 20;
}

function calculateKeywordMatch(resume, jd) {
  if (!jd) return 50;

  const jdLower = jd.toLowerCase();
  const keywords = [];

  // 从简历中提取关键词
  (resume.skills || []).forEach(s => keywords.push(s.toLowerCase()));
  if (resume.summary) {
    const summaryWords = resume.summary.toLowerCase().split(/[\s，。、]+/);
    keywords.push(...summaryWords.filter(w => w.length >= 4));
  }
  (resume.experience || []).forEach(exp => {
    if (exp.description) {
      const words = exp.description.toLowerCase().split(/[\s，。、]+/);
      keywords.push(...words.filter(w => w.length >= 4));
    }
  });

  if (!keywords.length) return 50;

  const uniqueKeywords = [...new Set(keywords)];
  let matched = 0;
  uniqueKeywords.forEach(kw => {
    if (jdLower.includes(kw)) matched++;
  });

  return Math.min(100, Math.round((matched / Math.min(uniqueKeywords.length, 20)) * 100));
}

function getMatchedSkills(resumeSkills, jobRequirements) {
  const matched = [];
  jobRequirements.forEach(req => {
    if (resumeSkills.some(skill => skill.includes(req) || req.includes(skill))) {
      matched.push(req);
    }
  });
  return matched;
}

function getMissingSkills(resumeSkills, jobRequirements) {
  return jobRequirements.filter(req => {
    return !resumeSkills.some(skill => skill.includes(req) || req.includes(skill));
  });
}

function getScoreLevel(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'mid';
  return 'low';
}

function getScoreLabel(score) {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function getScoreColor(score) {
  if (score >= 80) return '#a6e3a1';
  if (score >= 60) return '#f9e2af';
  return '#f38ba8';
}

module.exports = {
  calculateMatch,
  getScoreLevel,
  getScoreLabel,
  getScoreColor
};
