Page({
  data: {},

  handleWechatLogin(e) {
    if (e.detail.userInfo) {
      wx.setStorageSync('userInfo', e.detail.userInfo);
      wx.switchTab({
        url: '/pages/index/index'
      });
    } else {
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
  },

  handlePhoneLogin() {
    // 模拟手机号登录
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})
