const storage = require('../../utils/storage');
const matchUtil = require('../../utils/match');

const STATUS_MAP = {
  new: { label: '新职位', color: 'tag-blue' },
  applied: { label: '已投递', color: 'tag-yellow' },
  interviewing: { label: '面试中', color: 'tag-peach' },
  offer: { label: '已录用', color: 'tag-green' },
  rejected: { label: '已结束', color: 'tag-red' }
};

const STATUS_FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'new', label: '新职位' },
  { key: 'applied', label: '已投递' },
  { key: 'interviewing', label: '面试中' },
  { key: 'offer', label: '已录用' },
  { key: 'rejected', label: '已结束' }
];

Page({
  data: {
    jobs: [],
    filteredJobs: [],
    statusFilters: STATUS_FILTERS,
    activeFilter: 'all',
    searchKeyword: '',
    resume: null
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

    const jobsWithMeta = jobs.map(job => {
      const match = matchUtil.calculateMatch(resume, job);
      return {
        ...job,
        score: match.total,
        matchLabel: matchUtil.getScoreLabel(match.total),
        statusInfo: STATUS_MAP[job.status] || STATUS_MAP.new
      };
    });

    jobsWithMeta.sort((a, b) => b.score - a.score);

    this.setData({
      resume,
      jobs: jobsWithMeta,
      filteredJobs: jobsWithMeta
    });

    this.applyFilter();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.applyFilter();
    });
  },

  clearSearch() {
    this.setData({ searchKeyword: '' }, () => {
      this.applyFilter();
    });
  },

  switchFilter(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeFilter: key }, () => {
      this.applyFilter();
    });
  },

  applyFilter() {
    const { jobs, activeFilter, searchKeyword } = this.data;
    let result = jobs;

    if (activeFilter !== 'all') {
      result = result.filter(j => j.status === activeFilter);
    }

    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter(j =>
        (j.company && j.company.toLowerCase().includes(kw)) ||
        (j.title && j.title.toLowerCase().includes(kw)) ||
        (j.location && j.location.toLowerCase().includes(kw))
      );
    }

    this.setData({ filteredJobs: result });
  },

  goToJobDetail(e) {
    const jobId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/job-add/job-add?jobId=${jobId}&mode=view`
    });
  },

  addJob() {
    wx.navigateTo({ url: '/pages/job-add/job-add' });
  },

  onLongPress(e) {
    const jobId = e.currentTarget.dataset.id;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: `/pages/job-add/job-add?jobId=${jobId}&mode=edit`
          });
        } else if (res.tapIndex === 1) {
          wx.showModal({
            title: '确认删除',
            content: '删除后无法恢复，是否继续？',
            confirmColor: '#f38ba8',
            success: (modalRes) => {
              if (modalRes.confirm) {
                storage.deleteJob(jobId);
                this.loadData();
                wx.showToast({ title: '已删除', icon: 'success' });
              }
            }
          });
        }
      }
    });
  }
});
