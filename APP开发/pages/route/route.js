Page({
  data: {
    currentTheme: 'pixel', // pixel, pink, galaxy
    isNight: false,
    themeNameMap: {
      'pixel': '经典像素',
      'pink': '可爱粉萌',
      'galaxy': '璀璨星系'
    },
    currentCityStyle: 'ancient', // ancient, modern
    currentCityStyleName: '古城古色',
    activeIndex: -1,
    currentTripIndex: 0,
    trips: [],
    steps: [],
    canvasWidth: 0,
    canvasHeight: 0
  },

  onLoad() {
    this.checkDayNight();
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      canvasWidth: systemInfo.windowWidth,
      canvasHeight: systemInfo.windowHeight
    });
  },

  onShow() {
    this.loadTrips()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }
  },

  loadTrips() {
    const savedTrips = wx.getStorageSync('trips')
    if (savedTrips && savedTrips.length > 0) {
      const currentTripIndex = this.data.currentTripIndex < savedTrips.length ? this.data.currentTripIndex : 0
      this.setData({
        trips: savedTrips,
        currentTripIndex: currentTripIndex,
        steps: this.formatSteps(savedTrips[currentTripIndex].plan)
      })
      this.identifyCityStyle(savedTrips[currentTripIndex].title)
    }
  },

  formatSteps(plan) {
    // 为步骤添加默认图片
    const defaultImages = [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400"
    ]
    return plan.map((item, index) => ({
      ...item,
      desc: item.location, // 简单映射
      image: defaultImages[index % defaultImages.length]
    }))
  },

  selectTrip() {
    const tripNames = this.data.trips.map(t => t.title)
    if (tripNames.length === 0) {
      wx.showToast({ title: '暂无行程', icon: 'none' })
      return
    }

    wx.showActionSheet({
      itemList: tripNames,
      success: (res) => {
        const index = res.tapIndex
        const selectedTrip = this.data.trips[index]
        this.setData({
          currentTripIndex: index,
          steps: this.formatSteps(selectedTrip.plan)
        })
        this.identifyCityStyle(selectedTrip.title)
        wx.vibrateShort()
      }
    })
  },

  checkDayNight() {
    const hour = new Date().getHours()
    // 假设 6:00 - 18:00 为白天
    const isNight = hour < 6 || hour >= 18
    this.setData({
      isNight: isNight,
      currentTheme: isNight ? 'galaxy' : 'pixel'
    })
  },

  toggleDayNight() {
    const newIsNight = !this.data.isNight
    this.setData({
      isNight: newIsNight,
      currentTheme: newIsNight ? 'galaxy' : 'pixel'
    })
    wx.vibrateShort()
  },

  identifyCityStyle(cityName) {
    if (cityName.includes("大理") || cityName.includes("丽江")) {
      this.setData({
        currentCityStyle: 'ancient',
        currentCityStyleName: '古城古色'
      })
    } else {
      this.setData({
        currentCityStyle: 'modern',
        currentCityStyleName: '现代都市'
      })
    }
  },

  switchTheme() {
    const themes = ['pixel', 'pink', 'galaxy']
    let nextIdx = (themes.indexOf(this.data.currentTheme) + 1) % themes.length
    this.setData({
      currentTheme: themes[nextIdx]
    })
    wx.vibrateShort()
  },

  showStepDetail(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      activeIndex: index
    })
  },

  closeDetail() {
    this.setData({
      activeIndex: -1
    })
  },

  downloadLongImage() {
    wx.showLoading({
      title: '正在保存',
    });

    // 当前实现仅截取屏幕可见区域并保存到相册。
    // 微信小程序暂不支持直接将 WXML 结构渲染为图片以实现长图截取。
    // 如需实现超出屏幕的长图截取功能，通常需要以下更复杂的步骤：
    // 1. 获取所有需要绘制的 WXML 元素的布局信息 (包括文本、图片等)。
    // 2. 创建一个足够大的离屏 Canvas。
    // 3. 遍历 WXML 元素，将它们逐个绘制到 Canvas 上。
    //    - 图片需要先下载到本地临时文件再绘制。
    //    - 文本需要手动处理字体、颜色、位置等。
    // 4. 将离屏 Canvas 的内容导出为图片并保存。
    // 这是一个复杂的过程，可能需要借助第三方库或大量的自定义绘制代码。
    // 目前的代码仅演示截取当前屏幕 Canvas 区域的功能。

    const query = wx.createSelectorQuery().in(this);
    let maxBottom = 0; // 用于计算长图总高度
    let scrollViewTop = 0; // 滚动区域的顶部位置

    query.select('.route-scroll-view').boundingClientRect(res => {
      console.log("Scroll View Bounding Rect:", res);
      if (res) {
        scrollViewTop = res.top;
      }
    });
    query.selectAll('.route-scroll-view .node-wrapper, .route-scroll-view .route-top-info, .route-scroll-view .route-footer-actions')
      .fields({
        rect: true,
        computedStyle: [
          'background-color',
          'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
          'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
          'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
          'border-radius'
        ]
      })
    query.selectAll('.route-scroll-view image')
      .fields({ rect: true, properties: ['src'] })
    query.selectAll(
        '.route-header .header-title, ' +
        '.route-top-info .city-pill text, ' +
        '.node-wrapper .photo-card .photo-info .p-name, ' +
        '.node-wrapper .photo-card .photo-info .p-desc, ' +
        '.node-tag, ' +
        '.route-footer-actions .footer-btn text, ' +
        '.detail-panel .p-time, ' +
        '.detail-panel .p-location, ' +
        '.detail-panel .p-desc, ' +
        '.detail-panel .p-btn'
      )
      .fields({
        rect: true,
        properties: ['innerText'],
        computedStyle: ['font-size', 'color', 'text-align', 'font-weight', 'line-height']
      })
    query.selectAll(
        '.route-header, ' +
        '.route-top-info .city-pill, ' +
        '.node-wrapper .photo-card, ' +
        '.node-wrapper .node-dot-outer, ' +
        '.node-wrapper .node-dot-inner, ' +
        '.node-tag, ' +
        '.route-footer-actions .footer-btn, ' +
        '.route-footer-actions .add-btn-circle, ' +
        '.detail-panel, ' +
        '.detail-panel .panel-header, ' +
        '.detail-panel .p-btn'
      )
      .fields({
        rect: true,
        computedStyle: [
          'background-color',
          'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
          'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
          'border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style',
          'border-radius',
          'box-shadow'
        ]
      })
      .select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((resArr) => {
        const scrollViewRect = resArr[0][0];
        const layoutElements = resArr[1]; // 主要布局元素 (包含背景边框样式)
        const imageElements = resArr[2]; // 所有图片元素的信息
        const textElements = resArr[3]; // 所有文本元素的信息
        const backgroundElements = resArr[4]; // 其他背景/边框元素信息
        const canvasNodeInfo = resArr[5][0]; // Canvas 节点信息

        if (!scrollViewRect || !layoutElements || !imageElements || !textElements || !backgroundElements || !canvasNodeInfo || !canvasNodeInfo.node) {
          wx.hideLoading();
          wx.showToast({ title: '无法获取页面元素信息', icon: 'none' });
          console.error('无法获取必要节点信息', resArr);
          return;
        }

        // 重新计算maxBottom
        maxBottom = 0;
        [...layoutElements, ...backgroundElements, ...imageElements, ...textElements].forEach(item => {
          if (item.rect.bottom > maxBottom) {
            maxBottom = item.rect.bottom;
          }
        });

        const longImageHeight = maxBottom - scrollViewRect.top; // 计算实际长图高度
        console.log("Calculated Long Image Height:", longImageHeight);

        const canvas = canvasNodeInfo.node;
        const ctx = canvas.getContext('2d');

        // 确保 Canvas 尺寸正确
        canvas.width = this.data.canvasWidth * 2; // 提高清晰度
        canvas.height = longImageHeight * 2; // 使用计算出的长图高度
        ctx.scale(2, 2); // 适应高分辨率

        // 清空 Canvas 并填充背景色
        ctx.clearRect(0, 0, this.data.canvasWidth, longImageHeight);
        ctx.fillStyle = '#ffffff'; // 默认白色背景
        ctx.fillRect(0, 0, this.data.canvasWidth, longImageHeight);

        // 绘制背景和边框
        [...layoutElements, ...backgroundElements].forEach(el => {
          const { left, top, width, height } = el.rect;
          const { backgroundColor, borderTopWidth, borderRightWidth, borderBottomWidth, borderLeftWidth, borderTopColor, borderRightColor, borderBottomColor, borderLeftColor, borderTopStyle, borderRightStyle, borderBottomStyle, borderLeftStyle, borderRadius } = el.computedStyle;

          ctx.save();

          // 绘制背景色
          if (backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(left, top - scrollViewRect.top, width, height);
          }

          // 绘制边框 (简化处理，不考虑圆角和复杂的边框样式)
          ctx.lineWidth = parseFloat(borderTopWidth || '0px');
          ctx.strokeStyle = borderTopColor || 'transparent';
          if (ctx.lineWidth > 0 && borderTopStyle !== 'none') {
            ctx.strokeRect(left, top - scrollViewRect.top, width, height);
          }
          // TODO: 更精确的边框绘制，包括圆角

          ctx.restore();
        });

        // 绘制图片
        const drawImagesPromise = imageElements.map(img => {
          return new Promise((resolve) => {
            if (img.src) {
              wx.getImageInfo({
                src: img.src,
                success: (imageInfo) => {
                  ctx.drawImage(imageInfo.path, img.rect.left, img.rect.top - scrollViewRect.top, img.rect.width, img.rect.height);
                  resolve();
                },
                fail: (err) => {
                  console.error('获取图片信息失败', img.src, err);
                  resolve(); // 即使失败也继续，不阻塞整体流程
                }
              });
            } else {
              resolve();
            }
          });
        });

        // 绘制文本
        const drawTextPromise = Promise.resolve().then(() => {
          textElements.forEach(textEl => {
            if (textEl.properties.innerText) {
              const { left, top, width, height } = textEl.rect;
              const { fontSize, color, textAlign, fontWeight, lineHeight } = textEl.computedStyle;

              ctx.save();
              ctx.font = `${fontWeight || 'normal'} ${fontSize} sans-serif`;
              ctx.fillStyle = color;

              let textX = left;
              if (textAlign === 'center') {
                textX = left + width / 2;
              } else if (textAlign === 'right') {
                textX = left + width;
              }
              ctx.textAlign = textAlign;

              // 简单的文本绘制，不处理复杂换行
              ctx.fillText(textEl.properties.innerText, textX, top - scrollViewRect.top + parseFloat(fontSize));
              ctx.restore();
            }
          });
        });

        Promise.all([Promise.all(drawImagesPromise), drawTextPromise]).then(() => {
          // 图片和文本绘制完成后，再生成临时文件并保存
          wx.canvasToTempFilePath({
            canvasId: 'myCanvas',
            x: 0,
            y: 0,
            width: this.data.canvasWidth,
            height: longImageHeight,
            destWidth: this.data.canvasWidth * 2,
            destHeight: longImageHeight * 2,
            success: (res) => {
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.hideLoading();
                  wx.showToast({ title: '保存成功' });
                },
                fail: (err) => {
                  wx.hideLoading();
                  wx.showToast({ title: '保存失败', icon: 'none' });
                  console.error('保存图片失败', err);
                }
              });
            },
            fail: (err) => {
              wx.hideLoading();
              wx.showToast({ title: '生成图片失败', icon: 'none' });
              console.error('生成图片失败', err);
            }
          }, this);
        });
      });
  }
})