const storage = require('../../utils/storage');
const matchUtil = require('../../utils/match');

Page({
  data: {
    resume: null,
    jobs: [],
    topMatches: [],
    stats: {
      totalJobs: 0,
      highMatches: 0,
      pendingJobs: 0
    }
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const resume = storage.getResume();
    const jobs = storage.getJobs();

    // 计算所有匹配度
    const jobsWithScore = jobs.map(job => {
      const match = matchUtil.calculateMatch(resume, job);
      return { ...job, score: match.total, match, matchLabel: matchUtil.getScoreLabel(match.total) };
    });

    // 排序：高分在前
    jobsWithScore.sort((a, b) => b.score - a.score);

    const topMatches = jobsWithScore.slice(0, 3);
    const highMatches = jobsWithScore.filter(j => j.score >= 80).length;
    const pendingJobs = jobs.filter(j => j.status === 'new' || j.status === 'applied').length;

    this.setData({
      resume,
      jobs: jobsWithScore,
      topMatches,
      stats: {
        totalJobs: jobs.length,
        highMatches,
        pendingJobs
      }
    });
  },

  goToResume() {
    wx.switchTab({ url: '/pages/resume/resume' });
  },

  goToJobs() {
    wx.switchTab({ url: '/pages/jobs/jobs' });
  },

  goToMatch() {
    wx.switchTab({ url: '/pages/match/match' });
  },

  goToJobDetail(e) {
    const jobId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/job-add/job-add?jobId=${jobId}&mode=view`
    });
  },

  addJob() {
    wx.navigateTo({ url: '/pages/job-add/job-add' });
  }
});
