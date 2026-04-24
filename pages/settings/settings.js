const storage = require('../../utils/storage');

Page({
  data: {
    settings: {
      matchThreshold: 60,
      autoMatch: true
    },
    version: '1.0.0'
  },

  onLoad() {
    this.loadSettings();
  },

  onShow() {
    this.loadSettings();
  },

  loadSettings() {
    const settings = storage.getSettings();
    this.setData({ settings });
  },

  onThresholdChange(e) {
    const value = parseInt(e.detail.value);
    const settings = { ...this.data.settings, matchThreshold: value };
    this.setData({ settings });
    storage.setSettings(settings);
  },

  onAutoMatchChange(e) {
    const value = e.detail.value;
    const settings = { ...this.data.settings, autoMatch: value };
    this.setData({ settings });
    storage.setSettings(settings);
    wx.showToast({ title: value ? '已开启' : '已关闭', icon: 'success' });
  },

  clearAllData() {
    wx.showModal({
      title: '确认清除',
      content: '这将删除所有职位和简历数据，此操作不可恢复！',
      confirmColor: '#f38ba8',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          // 重新初始化
          const app = getApp();
          if (app && app.initStorage) {
            app.initStorage();
          }
          this.setData({
            settings: { matchThreshold: 60, autoMatch: true }
          });
          wx.showToast({ title: '数据已清除', icon: 'success' });
        }
      }
    });
  },

  clearJobsOnly() {
    wx.showModal({
      title: '确认删除',
      content: '这将删除所有职位数据，简历数据会保留。是否继续？',
      confirmColor: '#f38ba8',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('jobs');
          wx.removeStorageSync('hasDemoData');
          wx.showToast({ title: '职位已清除', icon: 'success' });
        }
      }
    });
  },

  resetDemoData() {
    wx.showModal({
      title: '重置演示数据',
      content: '这将恢复默认的演示职位和简历数据，你现有的数据将被覆盖。是否继续？',
      confirmColor: '#f38ba8',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('jobs');
          wx.removeStorageSync('resume');
          wx.removeStorageSync('hasDemoData');
          const app = getApp();
          if (app && app.initStorage) {
            app.initStorage();
          }
          wx.showToast({ title: '已重置', icon: 'success' });
        }
      }
    });
  }
});
