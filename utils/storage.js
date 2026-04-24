const STORAGE_KEYS = {
  RESUME: 'resume',
  JOBS: 'jobs',
  SETTINGS: 'settings'
};

function getResume() {
  return wx.getStorageSync(STORAGE_KEYS.RESUME) || {};
}

function setResume(resume) {
  wx.setStorageSync(STORAGE_KEYS.RESUME, resume);
}

function getJobs() {
  return wx.getStorageSync(STORAGE_KEYS.JOBS) || [];
}

function setJobs(jobs) {
  wx.setStorageSync(STORAGE_KEYS.JOBS, jobs);
}

function addJob(job) {
  const jobs = getJobs();
  job.id = 'job_' + Date.now();
  job.createdAt = Date.now();
  job.status = job.status || 'new';
  jobs.unshift(job);
  setJobs(jobs);
  return job;
}

function updateJob(jobId, updates) {
  const jobs = getJobs();
  const index = jobs.findIndex(j => j.id === jobId);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates };
    setJobs(jobs);
    return jobs[index];
  }
  return null;
}

function deleteJob(jobId) {
  let jobs = getJobs();
  jobs = jobs.filter(j => j.id !== jobId);
  setJobs(jobs);
}

function getSettings() {
  return wx.getStorageSync(STORAGE_KEYS.SETTINGS) || {
    matchThreshold: 60,
    autoMatch: true
  };
}

function setSettings(settings) {
  wx.setStorageSync(STORAGE_KEYS.SETTINGS, settings);
}

module.exports = {
  getResume,
  setResume,
  getJobs,
  setJobs,
  addJob,
  updateJob,
  deleteJob,
  getSettings,
  setSettings
};
