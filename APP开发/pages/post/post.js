Page({
  data: {
    postId: 'wuxing',
    post: {
      tag: '星轨漫游指南',
      title: '星轨漫游指南：五行能量场的星际跃迁之旅',
      subTitle: '一次精准的跃迁，是一场灵魂的能量校准',
      author: '水行迹编辑部',
      time: '',
      blocks: []
    },
    liked: false,
    likeCount: 0,
    comments: [],
    commentCount: 0,
    draftComment: '',
    replyToId: null,
    replyToName: ''
  },
  onLoad(options) {
    const postId = options.id || 'wuxing'
    const time = this._formatDateTime(new Date())
    this.setData({
      postId,
      post: {
        ...this.data.post,
        time,
        blocks: this._getPostBlocks(postId)
      }
    })
    this._loadState()
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: -1 })
    }
  },
  onShareAppMessage() {
    return {
      title: this.data.post.title,
      path: `/pages/post/post?id=${this.data.postId}`
    }
  },
  toggleLike() {
    const { liked, likeCount } = this.data
    const nextLiked = !liked
    const nextCount = Math.max(0, likeCount + (nextLiked ? 1 : -1))
    this.setData({ liked: nextLiked, likeCount: nextCount })
    wx.setStorageSync(this._likeKey(), { liked: nextLiked, count: nextCount })
  },
  focusComment() {
    wx.pageScrollTo({ selector: '#comments', duration: 250 })
  },
  onInputComment(e) {
    this.setData({ draftComment: e.detail.value })
  },
  submitComment() {
    const content = (this.data.draftComment || '').trim()
    if (!content) return
    const userInfo = wx.getStorageSync('userInfo') || {}
    const nickName = userInfo.nickName || '旅行者'
    const avatarUrl = userInfo.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=traveler'
    const now = this._formatDateTime(new Date())
    const { replyToId, comments } = this.data
    const nextComments = comments.slice()

    if (replyToId) {
      const idx = nextComments.findIndex((c) => c.id === replyToId)
      if (idx !== -1) {
        if (!nextComments[idx].replies) nextComments[idx].replies = []
        nextComments[idx].replies.unshift({
          id: Date.now(),
          nickName,
          avatarUrl,
          content,
          time: now
        })
      }
      this.setData({
        comments: nextComments,
        commentCount: nextComments.length,
        draftComment: '',
        replyToId: null,
        replyToName: ''
      })
      wx.setStorageSync(this._commentKey(), nextComments)
      return
    }

    nextComments.unshift({
      id: Date.now(),
      nickName,
      avatarUrl,
      content,
      time: now,
      likes: 0,
      liked: false,
      replies: []
    })
    this.setData({
      comments: nextComments,
      commentCount: nextComments.length,
      draftComment: ''
    })
    wx.setStorageSync(this._commentKey(), nextComments)
  },
  startReply(e) {
    const { id, name } = e.currentTarget.dataset
    this.setData({ replyToId: id, replyToName: name || '' })
  },
  cancelReply() {
    this.setData({ replyToId: null, replyToName: '' })
  },
  toggleCommentLike(e) {
    const { id } = e.currentTarget.dataset
    const comments = this.data.comments.slice()
    const idx = comments.findIndex((c) => c.id === id)
    if (idx === -1) return
    const c = comments[idx]
    const nextLiked = !c.liked
    const nextLikes = Math.max(0, (c.likes || 0) + (nextLiked ? 1 : -1))
    c.liked = nextLiked
    c.likes = nextLikes
    comments[idx] = c
    this.setData({ comments })
    wx.setStorageSync(this._commentKey(), comments)
  },
  onLongPressComment(e) {
    const { id } = e.currentTarget.dataset
    const userInfo = wx.getStorageSync('userInfo') || {}
    const nickName = userInfo.nickName || '旅行者'
    const comments = this.data.comments
    const idx = comments.findIndex((c) => c.id === id)
    if (idx === -1) return
    if (comments[idx].nickName !== nickName) {
      wx.showToast({ title: '只能删除自己的评论', icon: 'none' })
      return
    }
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          const nextComments = comments.slice()
          nextComments.splice(idx, 1)
          this.setData({ comments: nextComments, commentCount: nextComments.length })
          wx.setStorageSync(this._commentKey(), nextComments)
        }
      }
    })
  },
  onLongPressReply(e) {
    const { cid, rid } = e.currentTarget.dataset
    const userInfo = wx.getStorageSync('userInfo') || {}
    const nickName = userInfo.nickName || '旅行者'
    const comments = this.data.comments.slice()
    const cIdx = comments.findIndex((c) => c.id === cid)
    if (cIdx === -1) return
    const replies = comments[cIdx].replies || []
    const rIdx = replies.findIndex((r) => r.id === rid)
    if (rIdx === -1) return
    if (replies[rIdx].nickName !== nickName) {
      wx.showToast({ title: '只能删除自己的回复', icon: 'none' })
      return
    }
    wx.showActionSheet({
      itemList: ['删除'],
      success: (res) => {
        if (res.tapIndex === 0) {
          replies.splice(rIdx, 1)
          comments[cIdx].replies = replies
          this.setData({ comments })
          wx.setStorageSync(this._commentKey(), comments)
        }
      }
    })
  },
  _loadState() {
    const likeState = wx.getStorageSync(this._likeKey()) || {}
    let comments = wx.getStorageSync(this._commentKey()) || []
    comments = comments.map((c) => ({
      likes: 0,
      liked: false,
      replies: [],
      ...c,
      replies: Array.isArray(c.replies) ? c.replies : []
    }))
    this.setData({
      liked: !!likeState.liked,
      likeCount: typeof likeState.count === 'number' ? likeState.count : 0,
      comments,
      commentCount: comments.length
    })
  },
  _likeKey() {
    return `post_like_${this.data.postId}`
  },
  _commentKey() {
    return `post_comments_${this.data.postId}`
  },
  _formatDateTime(d) {
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`)
    return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  },
  _getPostBlocks(postId) {
    if (postId !== 'wuxing') return []
    return [
      '当我们在宇宙的星图上标注地球的坐标，会发现每一座城市都如同一颗独特的星辰，散发着金木水火土五种本源能量的辉光。人类的生命磁场与天地能量场同频共振，当自身五行有所偏失，便会陷入能量失衡的困境。',
      '一次精准的星际跃迁，不是简单的地理位移，而是一场灵魂的能量校准。前往与你五行互补的城市，就是借由大地星辰的能量潮汐，修复自身的能量裂隙，让生命回归和谐运转的轨道。',
      '🌳 木相能量缺失者：前往东方生命之林',
      '能量失衡征兆：思维凝滞、创造力枯竭、精神内耗严重、生命力萎缩',
      '木相能量对应宇宙中的生命原力，是星辰诞生时迸发的第一缕生机。木相缺失者如同失去光合作用的行星，陷入永恒的黑暗与沉寂。你需要前往东方，那里是太阳升起的方向，是生命能量最丰沛的星域。',
      '推荐跃迁坐标：杭州（西湖垂柳与茶园脉络）/ 武夷山（原始森林能量场）/ 安吉（竹海能量矩阵）/ 苏州（园林能量艺术）',
      '能量校准仪式：森林徒步、采茶冥想、星空露营、入住被绿植环绕的能量居所',
      '🔥 火相能量缺失者：前往南方烈焰之境',
      '能量失衡征兆：行动力迟缓、意志消沉、体温偏低、情感淡漠',
      '火相能量对应宇宙中的恒星之力，是光与热的本源。火相缺失者如同熄灭的恒星，失去了发光发热的能力。你需要前往南方，那里是太阳直射的区域，是火相能量最炽烈的星域。',
      '推荐跃迁坐标：广州 / 深圳 / 长沙 / 重庆',
      '能量校准仪式：日光浴、品尝辛辣美食、观看烟花表演、参与热闹的市集活动',
      '🏔️ 土相能量缺失者：前往中原大地之核',
      '能量失衡征兆：心浮气躁、缺乏安全感、注意力不集中、做事半途而废',
      '土相能量对应宇宙中的行星内核，是稳定与承载的力量。土相缺失者如同脱离轨道的卫星，在宇宙中漫无目的地飘荡。你需要前往中原，那里是大地的中心，是土相能量最厚重的星域。',
      '推荐跃迁坐标：洛阳 / 西安 / 北京 / 郑州',
      '能量校准仪式：参观博物馆、攀登古城墙、探访历史遗址、体验农耕文化',
      '⚜️ 金相能量缺失者：前往西方金属之域',
      '能量失衡征兆：优柔寡断、边界感模糊、缺乏决断力、容易被他人影响',
      '金相能量对应宇宙中的金属星辰，是规则与锋芒的力量。金相缺失者如同没有开刃的宝剑，无法保护自己也无法斩断羁绊。你需要前往西方，那里是太阳落下的方向，是金相能量最纯粹的星域。',
      '推荐跃迁坐标：敦煌 / 拉萨 / 西安 / 成都',
      '能量校准仪式：观赏雪山、参观青铜器博物馆、佩戴金属饰品、体验手工制作',
      '💧 水相能量缺失者：前往北方水之国度',
      '能量失衡征兆：脾气急躁、容易冲动、思维僵化、人际关系紧张',
      '水相能量对应宇宙中的液态星辰，是智慧与流动的力量。水相缺失者如同干涸的河流，失去了灵动与变通的能力。你需要前往北方，那里是水的故乡，是水相能量最充沛的星域。',
      '推荐跃迁坐标：青岛 / 桂林 / 杭州 / 上海',
      '能量校准仪式：海边漫步、乘船游览、漂流探险、雨天散步',
      '🌟 宇宙能量通用法则',
      '最佳跃迁时间：春季补木、夏季补火、长夏补土、秋季补金、冬季补水',
      '能量着装指南：补木着青绿、补火着红紫、补土着黄棕、补金着白金、补水着蓝黑',
      '随身能量信物：携带对应五行的饰品，如木质手串、红玛瑙、黄玉、银饰、蓝水晶',
      '💡 星际漫游须知：五行能量学说源自古老的东方智慧，是人类对宇宙规律的朴素认知。真正的能量提升，源于内心的平静与觉醒。',
      '🚀 专属星际跃迁定制服务',
      '不想在茫茫星海中盲目航行？想让每一次星际跃迁都成为你能量升级的契机？打赏本文任意星币，我将根据你的先天五行星盘和可用跃迁时间，为你定制一份专属的能量提升星际行程。',
      '在评论区留下你的五行属性和最向往的星际坐标，@你的星际旅伴，一起开启这场宇宙能量校准之旅吧！'
    ]
  }
})

