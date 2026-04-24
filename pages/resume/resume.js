const storage = require('../../utils/storage');

Page({
  data: {
    resume: {},
    isEditing: false,
    newSkill: '',
    newRole: '',
    newCity: '',
    expCompany: '',
    expTitle: '',
    expDuration: '',
    expDesc: '',
    eduSchool: '',
    eduMajor: '',
    eduDegree: '',
    eduDuration: ''
  },

  onLoad() {
    this.loadResume();
  },

  onShow() {
    this.loadResume();
  },

  loadResume() {
    const resume = storage.getResume();
    this.setData({ resume });
  },

  toggleEdit() {
    this.setData({ isEditing: !this.data.isEditing });
  },

  saveResume() {
    storage.setResume(this.data.resume);
    this.setData({ isEditing: false });
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`resume.${field}`]: e.detail.value
    });
  },

  onSalaryInput(e) {
    const field = e.currentTarget.dataset.field;
    const value = parseInt(e.detail.value) || 0;
    this.setData({
      [`resume.targetSalary.${field}`]: value
    });
  },

  // 技能标签
  onSkillInput(e) {
    this.setData({ newSkill: e.detail.value });
  },

  addSkill() {
    const skill = this.data.newSkill.trim();
    if (!skill) return;
    const skills = this.data.resume.skills || [];
    if (!skills.includes(skill)) {
      skills.push(skill);
      this.setData({
        'resume.skills': skills,
        newSkill: ''
      });
    }
  },

  removeSkill(e) {
    const index = e.currentTarget.dataset.index;
    const skills = this.data.resume.skills || [];
    skills.splice(index, 1);
    this.setData({ 'resume.skills': skills });
  },

  // 目标职位
  onRoleInput(e) {
    this.setData({ newRole: e.detail.value });
  },

  addRole() {
    const role = this.data.newRole.trim();
    if (!role) return;
    const roles = this.data.resume.targetRoles || [];
    if (!roles.includes(role)) {
      roles.push(role);
      this.setData({
        'resume.targetRoles': roles,
        newRole: ''
      });
    }
  },

  removeRole(e) {
    const index = e.currentTarget.dataset.index;
    const roles = this.data.resume.targetRoles || [];
    roles.splice(index, 1);
    this.setData({ 'resume.targetRoles': roles });
  },

  // 目标城市
  onCityInput(e) {
    this.setData({ newCity: e.detail.value });
  },

  addCity() {
    const city = this.data.newCity.trim();
    if (!city) return;
    const cities = this.data.resume.targetCities || [];
    if (!cities.includes(city)) {
      cities.push(city);
      this.setData({
        'resume.targetCities': cities,
        newCity: ''
      });
    }
  },

  removeCity(e) {
    const index = e.currentTarget.dataset.index;
    const cities = this.data.resume.targetCities || [];
    cities.splice(index, 1);
    this.setData({ 'resume.targetCities': cities });
  },

  // 工作经历
  onExpInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`${field}`]: e.detail.value });
  },

  addExperience() {
    const { expCompany, expTitle, expDuration, expDesc } = this.data;
    if (!expCompany || !expTitle) {
      wx.showToast({ title: '请填写公司和职位', icon: 'none' });
      return;
    }
    const experience = this.data.resume.experience || [];
    experience.unshift({
      company: expCompany,
      title: expTitle,
      duration: expDuration,
      description: expDesc
    });
    this.setData({
      'resume.experience': experience,
      expCompany: '',
      expTitle: '',
      expDuration: '',
      expDesc: ''
    });
  },

  removeExperience(e) {
    const index = e.currentTarget.dataset.index;
    const experience = this.data.resume.experience || [];
    experience.splice(index, 1);
    this.setData({ 'resume.experience': experience });
  },

  // 教育经历
  onEduInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`${field}`]: e.detail.value });
  },

  addEducation() {
    const { eduSchool, eduMajor, eduDegree, eduDuration } = this.data;
    if (!eduSchool || !eduMajor) {
      wx.showToast({ title: '请填写学校和专业', icon: 'none' });
      return;
    }
    const education = this.data.resume.education || [];
    education.unshift({
      school: eduSchool,
      major: eduMajor,
      degree: eduDegree,
      duration: eduDuration
    });
    this.setData({
      'resume.education': education,
      eduSchool: '',
      eduMajor: '',
      eduDegree: '',
      eduDuration: ''
    });
  },

  removeEducation(e) {
    const index = e.currentTarget.dataset.index;
    const education = this.data.resume.education || [];
    education.splice(index, 1);
    this.setData({ 'resume.education': education });
  }
});
