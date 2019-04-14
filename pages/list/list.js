const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

Page({
  date: {
    weekWeather: [],
    city: '北京市'
  },

  onLoad (options) {
    console.log('list.js onLoad()!')
    this.setData({
      city: options.city
    })
    this.getWeekWeather()
  },

  onReady() {
    // Do something when page ready.
    console.log('list.js onReady()!')
  },
  onShow () {
    // Do something when page show.
    console.log('list.js onShow()!')
  },
  onHide() {
    // Do something when page hide.
    console.log('list.js onHide()!')
  },
  onUnload() {
    // Do something when page close.
    console.log('list.js onUnload()!')
  },
  onPullDownRefresh() {
    // Do something when pull down.
    console.log('list.js onPullDownRefresh()!')
  },
  onReachBottom() {
    // Do something when page reach bottom.
    console.log('list.js onReachBottom()!')
  },
  onShareAppMessage() {
    // return custom share data when user share.
    console.log('list.js onShareAppMessage()!')
  },
  onPageScroll() {
    // Do something when page scroll
    console.log('list.js onPageScroll()!')
  },
  onResize() {
    // Do something when page resize
    console.log('list.js onResize()!')
  },
  

  onPullDownRefresh() {
    this.getWeekWeather(() => {
      wx.stopPullDownRefresh()
    })
  },

  getWeekWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        time: new Date().getTime(),
        city: this.data.city
      },
      success: res => {
        let result = res.data.result
        this.setWeekWeather(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  setWeekWeather(result) {
    let weekWeather = []
    for (let i = 0; i < 7; i++) {
      let date = new Date()
      date.setDate(date.getDate() + i)
      weekWeather.push({
        day: dayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        temp: `${result[i].minTemp}° - ${result[i].maxTemp}°`,
        iconPath: '/images/' + result[i].weather + '-icon.png'
      })
    }
    weekWeather[0].day = '今天'
    this.setData({
      weekWeather: weekWeather
    })
  }
}) 