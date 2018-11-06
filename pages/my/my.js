// pages/my/my.js
var app = getApp()
Page({
  data:{
    userInfo: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo: userInfo
      });
    })
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  toOtherApp: function() {
    wx.navigateToMiniProgram({
      appId: 'wxe2aebf565b1a4d4e',
      // path: 'pages/theory_introduce/theory_introduce',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'developer',
      success(res) {
        console.log("跳转成功");
      }
    })
  }
})