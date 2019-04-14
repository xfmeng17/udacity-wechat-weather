const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: "",
    hourlyWeather: [],
    todayDate: '',
    todayTemp: '',
    city: '上海市',
    locationAuthType: UNPROMPTED
  },

  onLoad () {
    console.log('index.js onLoad()!')
    this.qqmapsdk = new QQMapWX({
      key: 'GLUBZ-BWXKX-W6F4R-ZO2WF-XD3FS-AUFHK'
    })
    wx.getSetting({
      success: res => {
        let auth = res.authSetting['scope.userLocation']
        let locationAuthType = auth ? AUTHORIZED
          : (auth === false) ? UNAUTHORIZED : UNPROMPTED
        this.setData({
          locationAuthType: locationAuthType
        })
        if (auth) {
          this.getCityAndWeather()
        } else {
          this.getNow()
        }
      },
      fail: () => {
        getNow()
      }
    })
  },

  onShow () {
    // Do something when page show.
    console.log('index.js onShow()!')
  },
  onReady () {
    // Do something when page ready.
    console.log('index.js onReady()!')
  },
  onHide() {
    // Do something when page hide.
    console.log('index.js onHide()!')
  },
  onUnload() {
    // Do something when page close.
    console.log('index.js onUnload()!')
  },
  onPullDownRefresh() {
    // Do something when pull down.
    console.log('index.js onPullDownRefresh()!')
  },
  onReachBottom() {
    // Do something when page reach bottom.
    console.log('index.js onReachBottom()!')
  },
  onShareAppMessage() {
    // return custom share data when user share.
    console.log('index.js onShareAppMessage()!')
  },
  onPageScroll() {
    // Do something when page scroll.
    console.log('index.js onPageScroll()!')
  },
  onResize() {
    // Do something when page resize.
    console.log('index.js onResize()!')
  },

  onPullDownRefresh () {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  },

  getNow (callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      success: res => {
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  
  setNow (result) {
    let temp = result.now.temp
    let weather = result.now.weather
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },

  setHourlyWeather (result) {
    let forecast = result.forecast
    let hourlyWeather = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  setToday (result) {
    let date = new Date()
    this.setData({
      todayDate: `${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()} 今天`,
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}`
    })
  },

  onTapDayWeather () {
    // wx.showToast()
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city
    })
  },

  onTapLocation () {
    this.getCityAndWeather()
  },

  getCityAndWeather () {
    wx.getLocation({
      success: res => {
        // console.log(res)
        this.setData({
          locationAuthType: AUTHORIZED
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            this.setData({
              city: city,
            })
            this.getNow()
          }
        })
      },
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED
        })
      }
    })
  }
})