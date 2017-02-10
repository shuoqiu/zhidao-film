var subjectUtil = require("../../utils/subjectUtil.js");
// pages/main/main.js
Page({
  data: {
    imgUrls: [
      '../../images/001.jpg',
      '../../images/002.jpg',
      '../../images/003.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    hidden: false,
    start: 1,
    count: 10
  },
  onLoad:function(e){
    this.judgeNetworkType();
    this.loadMovie();
    console.log(e);
  },
  judgeNetworkType:function(){
    var that = this;
    wx.getNetworkType({
      success: function(res) {
        if(res.networkType === 'none'){
          that.setData({
            hidden: true
          });
          wx.showToast({
            title: "请连接您的网络",
            icon: 'success',
            duration: 2000,
            mask: true
          })
        }
      }
    });
  },
  detail:function(e){
    getApp().detail(e);
  },
  loadMovie:function(){
    var page=this;
    wx.request({
      url: 'https://api.douban.com/v2/movie/in_theaters?count=' + page.data.count,
      data: {movies:[]},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'json'
      }, // 设置请求的 header
      success: function(res){
        var subjects=res.data.subjects;
        subjectUtil.processSubjects(subjects);
        page.setData({
          movies:subjects,
          hidden:true
        });
        try {
          wx.setStorageSync('movies', subjects);
        }catch(e){
          console.warn(e);
        }
      }
      // fail: function() {
      //   // fail
      // },
      // complete: function() {
      //   // complete
      // }
    });
  },
  onReachBottom:function(){
    var page = this;
    var start = page.data.start + page.data.count;
    page.setData({
      start: start,
      hidden: false
    });
    wx.request({
     url: 'https://api.douban.com/v2/movie/in_theaters?count=' + page.data.count + '&start=' + page.data.start,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'Content-Type': 'json'}, // 设置请求的 header
      success: function(res){
        // success
        var subjects = res.data.subjects;
        subjectUtil.processSubjects(subjects);
        //console.log(subjects.length);
        if(subjects.length!=0){
         var movies = wx.getStorageSync('movies');
         movies = movies.concat(subjects);
         page.setData({     
                movies: movies, 
                hidden: true
              });
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
        try{
          wx.setStorageSync('movies', movies);
        }catch(e){
          console.warn(e);            
        }
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
     return {
       title: '热映电影',
       desc: '我正在看热映的电影，你也一起来呀！',
       path: '/pages/main/main'
     }
   }
})