Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: 'pages/community/community',
        text: '星港社区',
        icon: 'body photo/星港社区(1).png'
      },
      {
        pagePath: 'pages/index/index',
        text: '深空驿站',
        icon: 'body photo/深空驿站(1).png'
      },
      {
        pagePath: 'pages/plan/plan',
        text: '航行日志',
        icon: 'body photo/航行日志(1).png'
      },
      {
        pagePath: 'pages/route/route',
        text: '星系图',
        icon: 'body photo/星系图(1).png'
      }
    ]
  },
  lifetimes: {
    attached() {
      this.updateSelected()
    }
  },
  pageLifetimes: {
    show() {
      this.updateSelected()
    }
  },
  methods: {
    updateSelected() {
      const pages = getCurrentPages()
      let currentRoute = pages[pages.length - 1]?.route || ''
      if (currentRoute.startsWith('/')) currentRoute = currentRoute.slice(1)
      const idx = this.data.list.findIndex((i) => i.pagePath === currentRoute)
      this.setData({ selected: idx === -1 ? 0 : idx })
    },
    switchTab(e) {
      const idx = e.currentTarget.dataset.index
      const item = this.data.list[idx]
      this.setData({ selected: idx })
      wx.switchTab({ url: `/${item.pagePath}` })
    }
  }
})

