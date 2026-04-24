const storage = require('../../utils/storage');
const matchUtil = require('../../utils/match');

const STATUS_MAP = {
  new: { label: '新职位', next: 'applied', color: 'tag-blue' },
  applied: { label: '已投递', next: 'interviewing', color: 'tag-yellow' },
  interviewing: { label: '面试中', next: 'offer', color: 'tag-peach' },
  offer: { label: '已录用', next: 'rejected', color: 'tag-green' },
  rejected: { label: '已结束', next: 'new', color: 'tag-red' }
};

const STATUS_OPTIONS = [
  { key: 'new', label: '新职位' },
  { key: 'applied', label: '已投递' },
  { key: 'interviewing', label: '面试中' },
  { key: 'offer', label: '已录用' },
  { key: 'rejected', label: '已结束' }
];

Page({
  data: {
    mode: 'add',
    jobId: null,
    job: {
      company: '',
      title: '',
      department: '',
      location: '',
      salaryMin: '',
      salaryMax: '',
      salaryUnit: 'k',
      type: '全职',
      jd: '',
      requirements: [],
      benefits: [],
      status: 'new'
    },
    resume: null,
    matchResult: null,
    newRequirement: '',
    newBenefit: '',
    statusOptions: STATUS_OPTIONS,
    statusIndex: 0,
    statusTagColor: 'tag-blue'
  },

  onLoad(options) {
    const resume = storage.getResume();
    this.setData({ resume });

    if (options.jobId) {
      const job = storage.getJobs().find(j => j.id === options.jobId);
      if (job) {
        const mode = options.mode || 'view';
        const match = matchUtil.calculateMatch(resume, job);
        const statusInfo = STATUS_MAP[job.status] || STATUS_MAP.new;
        this.setData({
          mode,
          jobId: options.jobId,
          job: { ...job },
          matchResult: match,
          statusIndex: this.getStatusIndex(job.status),
          statusTagColor: statusInfo.color
        });
        wx.setNavigationBarTitle({
          title: mode === 'edit' ? '编辑职位' : job.company
        });
      }
    } else {
      wx.setNavigationBarTitle({ title: '添加职位' });
    }
  },

  getStatusIndex(status) {
    const keys = STATUS_OPTIONS.map(s => s.key);
    const idx = keys.indexOf(status);
    return idx >= 0 ? idx : 0;
  },

  // 表单输入
  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`job.${field}`]: e.detail.value });
  },

  onSalaryInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = parseInt(e.detail.value) || '';
    this.setData({ [`job.${field}`]: value });
  },

  onTypeChange(e) {
    const types = ['全职', '兼职', '实习', '外包'];
    this.setData({ 'job.type': types[e.detail.value] });
  },

  // 要求标签
  onRequirementInput(e) {
    this.setData({ newRequirement: e.detail.value });
  },

  addRequirement() {
    const req = this.data.newRequirement.trim();
    if (!req) return;
    const reqs = this.data.job.requirements || [];
    if (!reqs.includes(req)) {
      reqs.push(req);
      this.setData({
        'job.requirements': reqs,
        newRequirement: ''
      });
    }
  },

  removeRequirement(e) {
    const index = e.currentTarget.dataset.index;
    const reqs = this.data.job.requirements || [];
    reqs.splice(index, 1);
    this.setData({ 'job.requirements': reqs });
  },

  // 福利标签
  onBenefitInput(e) {
    this.setData({ newBenefit: e.detail.value });
  },

  addBenefit() {
    const ben = this.data.newBenefit.trim();
    if (!ben) return;
    const bens = this.data.job.benefits || [];
    if (!bens.includes(ben)) {
      bens.push(ben);
      this.setData({
        'job.benefits': bens,
        newBenefit: ''
      });
    }
  },

  removeBenefit(e) {
    const index = e.currentTarget.dataset.index;
    const bens = this.data.job.benefits || [];
    bens.splice(index, 1);
    this.setData({ 'job.benefits': bens });
  },

  // 状态切换
  changeStatus() {
    const current = this.data.job.status;
    const keys = STATUS_OPTIONS.map(s => s.key);
    const idx = keys.indexOf(current);
    const nextIdx = (idx + 1) % keys.length;
    const nextStatus = keys[nextIdx];
    const statusInfo = STATUS_MAP[nextStatus] || STATUS_MAP.new;
    this.setData({
      'job.status': nextStatus,
      statusIndex: nextIdx,
      statusTagColor: statusInfo.color
    });
    if (this.data.mode !== 'add') {
      storage.updateJob(this.data.jobId, { status: nextStatus });
      wx.showToast({ title: STATUS_MAP[nextStatus].label, icon: 'success' });
    }
  },

  pickStatus(e) {
    const idx = parseInt(e.detail.value);
    const status = STATUS_OPTIONS[idx].key;
    const statusInfo = STATUS_MAP[status] || STATUS_MAP.new;
    this.setData({
      'job.status': status,
      statusIndex: idx,
      statusTagColor: statusInfo.color
    });
  },

  // 保存
  saveJob() {
    const { job, mode, jobId } = this.data;
    if (!job.company || !job.title) {
      wx.showToast({ title: '请填写公司和职位', icon: 'none' });
      return;
    }

    if (mode === 'add') {
      storage.addJob({ ...job });
      wx.showToast({ title: '添加成功', icon: 'success' });
    } else {
      storage.updateJob(jobId, { ...job });
      wx.showToast({ title: '保存成功', icon: 'success' });
    }

    setTimeout(() => {
      wx.navigateBack();
    }, 800);
  },

  // 删除
  deleteJob() {
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，是否继续？',
      confirmColor: '#f38ba8',
      success: (res) => {
        if (res.confirm) {
          storage.deleteJob(this.data.jobId);
          wx.showToast({ title: '已删除', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 800);
        }
      }
    });
  },

  // 切换编辑模式
  toggleEdit() {
    if (this.data.mode === 'edit') {
      this.saveJob();
    } else {
      this.setData({ mode: 'edit' });
      wx.setNavigationBarTitle({ title: '编辑职位' });
    }
  },

  // 展开/收起匹配详情
  toggleMatchDetail() {
    this.setData({ showMatchDetail: !this.data.showMatchDetail });
  }
});
