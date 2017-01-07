//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  },
  detail:function(e){
    //将电影的id存储到本地缓存中，命名为:"movieId"
    //wx.setStorageSync('movieId', e.currentTarget.id);
    wx.navigateTo({
      //url: '../detail/detail',
      url: '../detail/detail?id=' + e.currentTarget.id,
      success: function(res){
        // success
        console.log(res);
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})