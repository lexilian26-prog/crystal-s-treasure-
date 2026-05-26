Page({
  data: {
    status: 'start', // start, testing, result
    currentIndex: 0,
    answers: [],
    questions: [
      {
        id: 1,
        title: "你准备从地球出发进行星际旅行，出发前一天晚上你会？",
        options: [
          { tag: 'A', text: '用三维星图计算出 3 条最优跃迁航线，标注每个虫洞的通过时间，连补给站的口味都预定' },
          { tag: 'B', text: '大概看一下主要目的地的坐标，设置好飞船自动驾驶，然后收拾行李' },
          { tag: 'C', text: '只加满飞船燃料，把目的地设为 "银河系任意点"，其他到了再说' },
          { tag: 'D', text: '直接启动飞船，看到哪个方向的星云好看就往哪飞，连导航都不开' }
        ]
      },
      {
        id: 2,
        title: "航行途中，飞船雷达探测到一个未命名星球，大气层呈现出梦幻的粉紫色，你会？",
        options: [
          { tag: 'A', text: '忽略它，严格按照预定航线飞行，否则会错过下一个补给站的预约' },
          { tag: 'B', text: '稍微偏离航线，绕星球飞行一圈拍几张照片，然后继续赶路' },
          { tag: 'C', text: '降低飞船速度，进入星球轨道，找个安全的地方着陆探索 1-2 天' },
          { tag: 'D', text: '立刻关闭自动驾驶，全速冲向这个星球，取消所有后续计划' }
        ]
      },
      {
        id: 3,
        title: "你的飞船在穿越虫洞时发生了轻微故障，需要迫降在一个陌生星球维修 2 天，你会？",
        options: [
          { tag: 'A', text: '非常焦虑，立刻联系星际救援，同时重新计算所有后续行程的时间' },
          { tag: 'B', text: '有点不爽，但接受现实，利用这 2 天在星球附近逛逛' },
          { tag: 'C', text: '觉得太棒了，正好可以探索这个意外的星球' },
          { tag: 'D', text: '干脆把飞船卖了，在这个星球定居下来' }
        ]
      },
      {
        id: 4,
        title: "在星际旅店的公共休息区，一个长着三只眼睛的泽塔星人主动向你微笑，你会？",
        options: [
          { tag: 'A', text: '礼貌地点头示意，然后立刻戴上耳机继续看星图' },
          { tag: 'B', text: '微笑回应，如果对方主动说话，就用通用翻译器简单聊几句' },
          { tag: 'C', text: '主动走过去，问问它这个星球有什么好玩的地方' },
          { tag: 'D', text: '立刻凑过去，从它的家乡星球聊到宇宙大爆炸，邀请它一起喝一杯' }
        ]
      },
      {
        id: 5,
        title: "你在星际集市上迷路了，手机也没有信号，你会？",
        options: [
          { tag: 'A', text: '按照之前记的路线自己找，绝不向陌生人问路' },
          { tag: 'B', text: '找一个看起来比较友善的店主问路' },
          { tag: 'C', text: '随便找一个路人问路，顺便和它聊聊天' },
          { tag: 'D', text: '干脆不找了，跟着一个看起来很有趣的外星旅行团走' }
        ]
      },
      {
        id: 6,
        title: "当地星球举办一年一度的星际狂欢节，所有人都在街上跳舞庆祝，你会？",
        options: [
          { tag: 'A', text: '站在远处拍几张照片，然后回酒店休息' },
          { tag: 'B', text: '在边缘看一会儿，感受一下氛围' },
          { tag: 'C', text: '加入人群，跟着一起跳' },
          { tag: 'D', text: '成为狂欢的中心，教大家跳地球的广场舞' }
        ]
      },
      {
        id: 7,
        title: "你降落在一个新星球，走出飞船后首先会做什么？",
        options: [
          { tag: 'A', text: '打开星球历史数据库，研究这个星球的文明发展史和古代遗迹位置' },
          { tag: 'B', text: '拿出全息相机，拍一张飞船和星球全景的合影' },
          { tag: 'C', text: '闻一闻空气的味道，寻找附近最香的美食摊' },
          { tag: 'D', text: '随便选一个方向，徒步走进荒野，寻找没人去过的地方' }
        ]
      },
      {
        id: 8,
        title: "当地导游向你推荐了四个景点，你会优先选择哪个？",
        options: [
          { tag: 'A', text: '有一万年历史的古代文明神庙，里面刻着神秘的外星文字' },
          { tag: 'B', text: '全银河系最高的瀑布，从太空都能看到' },
          { tag: 'C', text: '当地最有名的美食街，汇聚了整个星系的特色小吃' },
          { tag: 'D', text: '一个只有当地人才知道的秘密洞穴，里面有会发光的水晶' }
        ]
      },
      {
        id: 9,
        title: "你听说星球的另一边有一个非常壮观的极光，但需要徒步穿越沙漠，你会？",
        options: [
          { tag: 'A', text: '立刻收拾装备，雇佣当地向导，明天一早就出发' },
          { tag: 'B', text: '查一下天气预报，选一个天气好的日子去' },
          { tag: 'C', text: '如果有朋友一起去就去，一个人就算了' },
          { tag: 'D', text: '太麻烦了，在网上看看别人拍的照片就行了' }
        ]
      },
      {
        id: 10,
        title: "你的星际旅行预算有限，你会把最多的钱花在什么地方？",
        options: [
          { tag: 'A', text: '飞船的燃料和维修，以及安全舒适的星际旅店' },
          { tag: 'B', text: '各种星球的门票和体验项目，比如太空跳伞、火山冲浪' },
          { tag: 'C', text: '当地的美食和特色饮品，每顿饭都要吃不同的' },
          { tag: 'D', text: '纪念品和特产，给每个朋友都带一份礼物' }
        ]
      },
      {
        id: 11,
        title: "在星际集市上看到一个漂亮的水晶项链，价格是预算的一半，你会？",
        options: [
          { tag: 'A', text: '毫不犹豫地买下来，难得来一次这个星球' },
          { tag: 'B', text: '犹豫一下，但最终还是会买，后面几天省着点花' },
          { tag: 'C', text: '货比三家，看看有没有更便宜的，或者和老板砍砍价' },
          { tag: 'D', text: '放弃，觉得一个项链不值得花这么多钱' }
        ]
      },
      {
        id: 12,
        title: "附近有两个加油站：一个便宜但排队3小时，另一个贵一倍不用排队，你会？",
        options: [
          { tag: 'A', text: '选择便宜的，排队 3 小时正好可以整理一下照片' },
          { tag: 'B', text: '看情况，如果时间充裕就选便宜的，赶时间就选贵的' },
          { tag: 'C', text: '选择贵的，不想把时间浪费在排队上' },
          { tag: 'D', text: '干脆不加油了，在这个星球多待几天' }
        ]
      },
      {
        id: 13,
        title: "你在飞船日志里写下的旅行目的是什么？",
        options: [
          { tag: 'A', text: '逃离地球的工作压力，找一个安静的地方好好休息' },
          { tag: 'B', text: '了解不同星球的文明和历史，增长自己的见识' },
          { tag: 'C', text: '认识来自各个星球的朋友，收集不同文明的故事' },
          { tag: 'D', text: '挑战自己的极限，体验宇宙中最刺激的事情' }
        ]
      },
      {
        id: 14,
        title: "旅行结束回到地球后，你做的第一件事是什么？",
        options: [
          { tag: 'A', text: '整理所有的照片和视频，写一篇详细的星际旅行日志' },
          { tag: 'B', text: '约上好朋友，给他们看旅行照片，分享有趣的故事' },
          { tag: 'C', text: '把带回来的纪念品分给大家，然后倒头就睡' },
          { tag: 'D', text: '立刻开始计划下一次星际旅行' }
        ]
      },
      {
        id: 15,
        title: "如果你的飞船可以加装一个终极功能，你会选择哪个？",
        options: [
          { tag: 'A', text: '无限燃料，永远不用担心飞船没油' },
          { tag: 'B', text: '万能翻译器，可以和任何智慧生命无障碍交流' },
          { tag: 'C', text: '次元储物空间，想买多少东西就买多少' },
          { tag: 'D', text: '时间静止器，可以永远停留在最美的时刻' }
        ]
      }
    ],
    resultsMap: {
      'A': {
        name: '星图导航员 (Starchart Navigator)',
        image: '/alien/Starchart Navigator_星图导航员.jpg',
        personas: [
          { name: '星图导航员', image: '/alien/Starchart Navigator_星图导航员.jpg' }
        ],
        desc: '核心特质：宇宙秩序的守护者，跃迁航线精确到秒。你认为 "随机跃迁" 是对星际航行的亵渎。',
        traits: '优点：极度可靠，提前规避风险。缺点：过于死板，难以享受意外之美。',
        behavior: '出发前打印3份行程表；随身携带应急包；严格按预定时间离开。',
        dest: '结构严谨的文明星球、星际博物馆',
        quote: '"根据星历表，我们还有 2.7 分钟抵达着陆点。"',
        dislike: '虫洞漂流者：无法理解不计划就跳进虫洞的行为，认为那是自杀。'
      },
      'B': {
        name: '星际外交官 / 遗迹考古学家',
        image: '/alien/Galactic Diplomat_星际外交官.jpg',
        personas: [
          { name: '星际外交官', image: '/alien/Galactic Diplomat_星际外交官.jpg' },
          { name: '遗迹考古学家', image: '/alien/Relic Archaeologist_遗迹考古学家.jpg' }
        ],
        desc: '核心本质：宇宙文化的桥梁，通过遗迹与过去对话，连接不同的灵魂。',
        traits: '优点：知识渊博或社交能力强；观察力敏锐；总能获得当地人优待。',
        behavior: '每到一个地方先交朋友或去博物馆；对着古老石碑研究一整天。',
        dest: '多元文化太空港、古代文明遗址',
        quote: '"你好，我来自地球，能交换一下文明徽章吗？"',
        dislike: '深空隐士 / 躺平度假者：无法理解独处或在酒店睡觉的行为，认为那是浪费。'
      },
      'C': {
        name: '虫洞漂流者 / 美食采集者 / 摄影记录者',
        image: '/alien/Wormhole Drifter_虫洞漂流者.jpg',
        personas: [
          { name: '虫洞漂流者', image: '/alien/Wormhole Drifter_虫洞漂流者.jpg' },
          { name: '美食采集者', image: '/alien/Gourmet Harvester_美食采集者.jpg' },
          { name: '摄影记录者', image: '/alien/Lens Recorder_摄影记录者.jpg' }
        ],
        desc: '核心本质：宇宙的自由灵魂，随波逐流的探险家，用镜头捕捉美好。',
        traits: '优点：适应力极强；总能发现隐藏美景；审美能力优秀。',
        behavior: '背包只有能量块；为一碗拉面跨越星系；凌晨3点起床拍日出。',
        dest: '神秘星云、美食星球、网红打卡地',
        quote: '"下一个跃迁点？看心情。这个星球闻起来就很好吃。"',
        dislike: '星图导航员 / 极限挑战者：无法理解军事演习般的旅行或把自己搞太累。'
      },
      'D': {
        name: '深空隐士 / 极限挑战者 / 购物掠夺者 / 躺平度假者',
        image: '/alien/Deep Space Hermit_深空隐士.jpg',
        personas: [
          { name: '深空隐士', image: '/alien/Deep Space Hermit_深空隐士.jpg' },
          { name: '极限挑战者', image: '/alien/Extreme Challenger_极限挑战者.jpg' },
          { name: '购物掠夺者', image: '/alien/Shopping Predator_购物掠夺者.jpg' },
          { name: '躺平度假者', image: '/alien/Vacation Hibernator_躺平度假者.jpg' }
        ],
        desc: '核心特质：宇宙的倾听者或冒险家，追求极致的放松或刺激。',
        traits: '优点：内心强大或勇敢无畏；懂得享受生活；眼光独到。',
        behavior: '住在最偏僻的酒店；在火山星球冲浪；能躺绝不坐。',
        dest: '无人观测站、极限运动胜地、豪华太空邮轮',
        quote: '"这里的信号真好，连一个通讯请求都没有。"',
        dislike: '星际外交官 / 躺平度假者：讨厌不停说话或觉得对方无聊。'
      }
    },
    finalResult: null
  },

  startTest() {
    this.setData({
      status: 'testing',
      currentIndex: 0,
      answers: []
    })
  },

  selectOption(e) {
    const { tag } = e.currentTarget.dataset
    const { currentIndex, questions, answers } = this.data
    const newAnswers = [...answers, tag]
    
    if (currentIndex < questions.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1,
        answers: newAnswers
      })
    } else {
      this.calculateResult(newAnswers)
    }
  },

  prevQuestion() {
    const { currentIndex, answers } = this.data
    if (currentIndex > 0) {
      const newAnswers = [...answers]
      newAnswers.pop() // 移除最后一个答案
      this.setData({
        currentIndex: currentIndex - 1,
        answers: newAnswers
      })
    }
  },

  calculateResult(answers) {
    const counts = { 'A': 0, 'B': 0, 'C': 0, 'D': 0 }
    answers.forEach(a => counts[a]++)
    
    let maxTag = 'A'
    let maxCount = counts['A']
    
    for (const tag in counts) {
      if (counts[tag] > maxCount) {
        maxCount = counts[tag]
        maxTag = tag
      }
    }
    
    this.setData({
      status: 'result',
      finalResult: this.data.resultsMap[maxTag]
    })
  },

  restart() {
    this.setData({
      status: 'start',
      currentIndex: 0,
      answers: [],
      finalResult: null
    })
  },

  back() {
    wx.navigateBack()
  }
})
