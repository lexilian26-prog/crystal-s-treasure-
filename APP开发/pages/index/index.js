const app = getApp()

Page({
  data: {
    userInfo: {},
    showSidebar: false,
    channels: [
      { id: 1, name: "美食频道", tag: "星球探店", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", lastUserAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Foodie", lastPost: "美食频道全是各个星球的探店帖，看得我直流口水。" },
      { id: 2, name: "冒险频道", tag: "极限足迹", image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=400", lastUserAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Explorer", lastPost: "刚从火星大峡谷回来，氧气差点不够..." },
      { id: 3, name: "摄影频道", tag: "光影捕捉", image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400", lastUserAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Photo", lastPost: "银河系的日落真的百看不厌..." },
      { id: 4, name: "装备频道", tag: "黑科技", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", lastUserAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech", lastPost: "新款抗压宇航服实测效果极佳！" }
    ],
    voyageLogs: [
      { id: 1, user: "星际漫游者", content: "在大理洱海边发现了一处绝美的星空观测点，推荐给大家！#浪漫星空", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400", tag: "大理", likes: 128 },
      { id: 2, user: "极光猎人", content: "分享我在北欧拍到的梦幻极光，真的像科幻片一样震撼。#极光之旅", image: "https://images.unsplash.com/photo-1531366930477-4f85a80693a7?w=400", tag: "冰岛", likes: 256 },
      { id: 3, user: "吃货宇航员", content: "这家店的能量补给包（其实是特色小吃）真的太好吃了，强烈推荐！", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", tag: "美食", likes: 89 },
      { id: 4, user: "孤独的观测者", content: "在沙漠中心等待日出的那一刻，感觉整个宇宙都安静了。#徒步日记", image: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=400", tag: "敦煌", likes: 420 }
    ]
  },

  onLoad() {
    this.refreshUserInfo()
  },

  onShow() {
    this.refreshUserInfo()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
  },

  refreshUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }
  },

  toggleSidebar() { this.setData({ showSidebar: !this.data.showSidebar }) },

  updateNickname(e) {
    const userInfo = this.data.userInfo
    userInfo.nickName = e.detail.value
    this.setData({ userInfo })
    wx.setStorageSync('userInfo', userInfo)
  },

  // 导航到新页面
  goToPlan(e) {
    this.setData({ showSidebar: false })
    wx.switchTab({
      url: '/pages/plan/plan'
    })
  },

  logout() { wx.reLaunch({ url: '/pages/login/login' }) }
})
