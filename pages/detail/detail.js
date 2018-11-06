var subjectUtitle = require("../../utils/subjectUtil.js");
// pages/detail/detail.js
Page({
  data:{
    hidden: false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  //  this.detailsData();
    this.detailsData(options.id);
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
  detailsData:function(movieId){
    var page = this;
    //从缓存中提取出命名为：movieId的值
    //var id = wx.getStorageSync('movieId');
    wx.request({
      //url: 'https://api.douban.com/v2/movie/subject/' + id,
      url: 'https://douban.uieee.com/v2/movie/subject/' + movieId,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      }, // 设置请求的 header
      success: function(res){
        // success
        var subject = res.data;
        subjectUtitle.processSubject(subject);
        page.setData({
        movie: subject,
        hidden: true
        });
        wx.setNavigationBarTitle({
          title: subject.title
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  onShareAppMessage: function(){
    var page = this;
    return {
      title: page.data.movie.title,
      desc: page.data.movie.summary,
      path: '/pages/detail/detail?id=' + page.data.movie.id
    }
  }
})