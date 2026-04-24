const storage = require('../../utils/storage');
const matchUtil = require('../../utils/match');

const FILTER_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: 'high', label: '高匹配 (≥80)' },
  { key: 'mid', label: '中匹配 (60-79)' },
  { key: 'low', label: '低匹配 (<60)' }
];

Page({
  data: {
    resume: null,
    jobs: [],
    filteredJobs: [],
    filterOptions: FILTER_OPTIONS,
    activeFilter: 'all',
    expandedJobId: null,
    matchThreshold: 60
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
    const settings = storage.getSettings();
    const matchThreshold = settings.matchThreshold || 60;

    const jobsWithMatch = jobs.map(job => {
      const match = matchUtil.calculateMatch(resume, job);
      return {
        ...job,
        score: match.total,
        match,
        matchLabel: matchUtil.getScoreLabel(match.total),
        matchColor: matchUtil.getScoreColor(match.total)
      };
    });

    jobsWithMatch.sort((a, b) => b.score - a.score);

    // 根据阈值过滤
    const thresholdJobs = jobsWithMatch.filter(j => j.score >= matchThreshold);

    this.setData({
      resume,
      jobs: jobsWithMatch,
      filteredJobs: thresholdJobs,
      matchThreshold
    });

    this.applyFilter();
  },

  switchFilter(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeFilter: key }, () => {
      this.applyFilter();
    });
  },

  applyFilter() {
    const { jobs, activeFilter, matchThreshold } = this.data;
    // 先按阈值过滤（基础集）
    let result = jobs.filter(j => j.score >= matchThreshold);

    if (activeFilter === 'high') {
      result = result.filter(j => j.score >= 80);
    } else if (activeFilter === 'mid') {
      result = result.filter(j => j.score >= 60 && j.score < 80);
    } else if (activeFilter === 'low') {
      result = result.filter(j => j.score < 60);
    }

    this.setData({ filteredJobs: result });
  },

  toggleExpand(e) {
    const jobId = e.currentTarget.dataset.id;
    this.setData({
      expandedJobId: this.data.expandedJobId === jobId ? null : jobId
    });
  },

  goToJobDetail(e) {
    const jobId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/job-add/job-add?jobId=${jobId}&mode=view`
    });
  },

  goToResume() {
    wx.switchTab({ url: '/pages/resume/resume' });
  },

  goToSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  }
});
