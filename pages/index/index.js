//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    show: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  jumpsubmit: function () {
    var goods_id = '';
    if (this.data.show == true) {
      goods_id = 1
    }else{
      goods_id = 2
    }
    wx.navigateTo({
      url: '/pages/form/form?goods_id=' + this.data.goods_id,
    })
  },
  click: function () {
    // console.log("1111111111111 " + this.data.motto)
    this.setData({ show: !this.data.show })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({ show: false })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 返回顶部
  data: {
    scrollTop: 0,
    floorstatus: false
  },
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  goTop2: function (e) {
    this.setData({
      scrollTop: 1835
    })
  },
  scroll: function (e) {
    if (e.detail.scrollTop > 1314) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  data: {
    topNum: 0
  },

  returnTop: function () {
    this.setData({
      topNum: this.data.topNum = 0
    });
  }
  //返回顶部结束 

})
