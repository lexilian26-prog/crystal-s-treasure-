Page({
  data: {
    showLinkModal: false,
    activeTab: 'trip',
    selectedTripIdx: 0, // 当前选中的行程索引（用于待办板块）
    editingTIdx: -1,
    editingSIdx: -1,
    editingTodoId: -1,
    editingLinkName: '',
    editingLinkUrl: '',
    trips: [],
    todoProgress: 0
  },

  onLoad(options) {
    if (options.tab) {
      this.setData({ activeTab: options.tab })
    }
    this.loadData()
  },

  onShow() {
    this.loadData()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  loadData() {
    let trips = wx.getStorageSync('trips') || []
    const userInfo = wx.getStorageSync('userInfo') || { nickName: '旅行者', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler' }
    
    // 兼容旧数据：如果行程中没有 todoList 或 members，则初始化
    trips = trips.map(trip => {
      if (!trip.todoList) trip.todoList = []
      if (!trip.members || trip.members.length === 0) {
        trip.members = [{ nickName: userInfo.nickName, avatarUrl: userInfo.avatarUrl }]
      }
      return trip
    })

    this.setData({ trips }, () => {
      this.calculateProgress()
    })
  },

  onShareAppMessage(res) {
    if (res.from === 'button') {
      const tidx = res.target.dataset.tidx
      const trip = this.data.trips[tidx]
      return {
        title: `邀你共同编辑行程：${trip.title}`,
        path: `/pages/plan/plan?id=${trip.id}`,
        imageUrl: '/images/share_trip.png' // 建议放一张精美的分享图
      }
    }
    return {
      title: '水行迹 - 你的星际航行助手',
      path: '/pages/index/index'
    }
  },

  mockAddMember(e) {
    const tidx = e.currentTarget.dataset.tidx
    const trips = this.data.trips
    const names = ['Felix', 'Aria', 'Jack', 'Luna', 'Nova']
    const newName = names[Math.floor(Math.random() * names.length)]
    
    trips[tidx].members.push({
      nickName: newName,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newName}`
    })
    
    this.setData({ trips })
    this._saveTrips()
    wx.showToast({ title: `已加入: ${newName}` })
  },

  selectTodoMember(e) {
    const { id } = e.currentTarget.dataset
    const { trips, selectedTripIdx } = this.data
    const members = trips[selectedTripIdx].members
    const selectedMember = members[e.detail.value]
    
    const todoList = trips[selectedTripIdx].todoList
    const index = todoList.findIndex(t => t.id === id)
    if (index !== -1) {
      todoList[index].member = selectedMember.nickName
      this.setData({ trips })
      this._saveTrips()
    }
  },

  _saveTrips() {
    wx.setStorageSync('trips', this.data.trips)
    this.calculateProgress()
  },

  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.tab })
  },

  selectTripForTodo(e) {
    this.setData({ selectedTripIdx: e.currentTarget.dataset.idx }, () => {
      this.calculateProgress()
    })
  },

  // 行程逻辑
  updateTripTitle(e) {
    const { tidx } = e.currentTarget.dataset
    const { value } = e.detail
    const trips = this.data.trips
    trips[tidx].title = value
    this.setData({ trips })
    this._saveTrips()
  },

  updateStep(e) {
    const { tidx, sidx, field } = e.currentTarget.dataset
    const { value } = e.detail
    const trips = this.data.trips
    trips[tidx].plan[sidx][field] = value
    this.setData({ trips })
    this._saveTrips()
  },

  voteStep(e) {
    const { tidx, sidx } = e.currentTarget.dataset
    const trips = this.data.trips
    const step = trips[tidx].plan[sidx]
    
    // 添加动画标记
    step.animating = true
    
    if (step.starred) {
      step.stars = (step.stars || 1) - 1
      step.starred = false
    } else {
      step.stars = (step.stars || 0) + 1
      step.starred = true
    }
    
    this.setData({ trips })
    this._saveTrips()

    // 1秒后移除动画标记，以便下次点击再次触发
    setTimeout(() => {
      const currentTrips = this.data.trips
      if (currentTrips[tidx] && currentTrips[tidx].plan[sidx]) {
        currentTrips[tidx].plan[sidx].animating = false
        this.setData({ trips: currentTrips })
      }
    }, 1000)
  },

  addStep(e) {
    const { tidx } = e.currentTarget.dataset
    const trips = this.data.trips
    trips[tidx].plan.push({
      time: "12:00",
      location: "新地点",
      stars: 0,
      starred: false,
      links: []
    })
    this.setData({ trips })
    this._saveTrips()
  },

  deleteTrip(e) {
    const { tidx } = e.currentTarget.dataset
    const trips = this.data.trips
    wx.showModal({
      title: '删除行程',
      content: `确定要删除“${trips[tidx].title}”吗？`,
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          trips.splice(tidx, 1)
          let nextIdx = this.data.selectedTripIdx
          if (nextIdx >= trips.length) nextIdx = Math.max(0, trips.length - 1)
          this.setData({ trips, selectedTripIdx: nextIdx })
          this._saveTrips()
        }
      }
    })
  },

  deleteStep(e) {
    const { tidx, sidx } = e.currentTarget.dataset
    const trips = this.data.trips
    wx.showModal({
      title: '删除地点',
      content: '确定要删除这个行程点吗？',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          trips[tidx].plan.splice(sidx, 1)
          this.setData({ trips })
          this._saveTrips()
        }
      }
    })
  },

  showCreateModal() {
    const userInfo = wx.getStorageSync('userInfo') || { nickName: '旅行者', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler' }
    const newId = 'TRIP' + Math.floor(Math.random() * 9000 + 1000)
    const newTrip = {
      id: newId,
      title: "新行程 " + newId,
      plan: [{ time: "09:00", location: "第一个目的地", stars: 0, starred: false, links: [] }],
      todoList: [],
      members: [{ nickName: userInfo.nickName, avatarUrl: userInfo.avatarUrl }]
    }
    const trips = this.data.trips
    trips.unshift(newTrip)
    this.setData({ trips, selectedTripIdx: 0 })
    this._saveTrips()
    wx.showToast({ title: '已创建' })
  },

  // 待办逻辑
  toggleTodo(e) {
    const id = e.currentTarget.dataset.id
    const { trips, selectedTripIdx } = this.data
    const todoList = trips[selectedTripIdx].todoList
    const index = todoList.findIndex(t => t.id === id)
    if (index !== -1) {
      todoList[index].completed = !todoList[index].completed
      this.setData({ trips })
      this._saveTrips()
    }
  },

  addTodo() {
    const { trips, selectedTripIdx } = this.data
    if (trips.length === 0) {
      wx.showToast({ title: '请先创建行程', icon: 'none' })
      return
    }
    trips[selectedTripIdx].todoList.push({ id: Date.now(), task: "新任务", member: "未分配", completed: false, links: [] })
    this.setData({ trips })
    this._saveTrips()
  },

  deleteTodo(e) {
    const id = e.currentTarget.dataset.id
    const { trips, selectedTripIdx } = this.data
    trips[selectedTripIdx].todoList = trips[selectedTripIdx].todoList.filter(t => t.id !== id)
    this.setData({ trips })
    this._saveTrips()
  },

  updateTodoTask(e) {
    const { id } = e.currentTarget.dataset
    const { trips, selectedTripIdx } = this.data
    const todoList = trips[selectedTripIdx].todoList
    const index = todoList.findIndex(t => t.id === id)
    if (index !== -1) {
      todoList[index].task = e.detail.value
      this.setData({ trips })
      this._saveTrips()
    }
  },

  updateTodoMember(e) {
    const { id } = e.currentTarget.dataset
    const { trips, selectedTripIdx } = this.data
    const todoList = trips[selectedTripIdx].todoList
    const index = todoList.findIndex(t => t.id === id)
    if (index !== -1) {
      todoList[index].member = e.detail.value
      this.setData({ trips })
      this._saveTrips()
    }
  },

  calculateProgress() {
    const { trips, selectedTripIdx } = this.data
    if (trips.length === 0 || !trips[selectedTripIdx] || trips[selectedTripIdx].todoList.length === 0) {
      this.setData({ todoProgress: 0 })
      return
    }
    const todoList = trips[selectedTripIdx].todoList
    const completedCount = todoList.filter(t => t.completed).length
    this.setData({ todoProgress: Math.round((completedCount / todoList.length) * 100) })
  },

  // 链接逻辑
  editStepLink(e) {
    const { tidx, sidx } = e.currentTarget.dataset
    this.setData({ showLinkModal: true, editingTIdx: tidx, editingSIdx: sidx, editingTodoId: -1, editingLinkName: '', editingLinkUrl: '' })
  },

  editTodoLink(e) {
    const { id } = e.currentTarget.dataset
    this.setData({ showLinkModal: true, editingTodoId: id, editingTIdx: -1, editingSIdx: -1, editingLinkName: '', editingLinkUrl: '' })
  },

  inputLinkName(e) { this.setData({ editingLinkName: e.detail.value }) },
  inputLinkUrl(e) { this.setData({ editingLinkUrl: e.detail.value }) },
  closeLinkModal() { this.setData({ showLinkModal: false }) },

  saveStepLink() {
    const { editingTIdx, editingSIdx, editingTodoId, editingLinkName, editingLinkUrl, trips, selectedTripIdx } = this.data
    if (editingTodoId !== -1) {
      const todoList = trips[selectedTripIdx].todoList
      const index = todoList.findIndex(t => t.id === editingTodoId)
      if (index !== -1) {
        if (!todoList[index].links) todoList[index].links = []
        todoList[index].links.push({ name: editingLinkName || '链接', url: editingLinkUrl })
        this.setData({ trips, showLinkModal: false })
        this._saveTrips()
      }
    } else {
      const step = trips[editingTIdx].plan[editingSIdx]
      if (!step.links) step.links = []
      step.links.push({ name: editingLinkName || '链接', url: editingLinkUrl })
      this.setData({ trips, showLinkModal: false })
      this._saveTrips()
    }
  },

  deleteLink(e) {
    const { tidx, sidx, lidx } = e.currentTarget.dataset
    this.data.trips[tidx].plan[sidx].links.splice(lidx, 1)
    this.setData({ trips: this.data.trips })
    this._saveTrips()
  },

  deleteTodoLink(e) {
    const { id, lidx } = e.currentTarget.dataset
    const { trips, selectedTripIdx } = this.data
    const index = trips[selectedTripIdx].todoList.findIndex(t => t.id === id)
    if (index !== -1) {
      trips[selectedTripIdx].todoList.splice(lidx, 1)
      this.setData({ trips })
      this._saveTrips()
    }
  },

  openLink(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.url,
      success: () => wx.showToast({ title: '已复制链接' })
    })
  }
})
