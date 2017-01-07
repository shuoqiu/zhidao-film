var subjectUtil = require("../../utils/subjectUtil.js");
// pages/recommend/recommend.js
Page({
  data:{
    movies:[],
    hidden: false,
    start: 1,
    count: 10
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '精选电影',
      success: function(res) {
        // success
      }
    })
    this.loadMovie();
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
  detail:function(e){
    getApp().detail(e);
  },
  loadMovie:function(){
    var page = this;
  wx.request({
    url: 'https://api.douban.com/v2/movie/top250',
    data: {},
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'Content-Type':'json'
    }, // 设置请求的 header
    success: function(res){
      var subjects = res.data.subjects;
      subjectUtil.processSubjects(subjects);
      page.setData({
        movies: subjects,
        hidden: true
      });
      wx.setStorageSync('movies', subjects);
    },
    fail: function() {
      // fail
    },
    complete: function() {
      // complete
    }
  })
},
onReachBottom:function(){
    var page = this;
    var start = page.data.start + page.data.count;
    page.setData({
      start: start,
      hidden: false
    });
    wx.request({
      url: 'https://api.douban.com/v2/movie/top250?count=' + page.data.count + '&start=' + page.data.start,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'Content-Type': 'json'}, // 设置请求的 header
      success: function(res){
        // success
        var subjects = res.data.subjects;
        subjectUtil.processSubjects(subjects);
        var movies = wx.getStorageSync('movies');
        movies = movies.concat(subjects);
        if(subjects.length!=0){
            page.setData({
              movies: movies,
              hidden: true
          });
          wx.setStorageSync('movies', movies);
        }else {
          page.setData({
            hidden: true
          });
          wx.showToast({
            title: '没内容啦',
            icon: 'success',
            duration: 2000
          });
        }
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