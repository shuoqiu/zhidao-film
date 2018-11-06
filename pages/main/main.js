var subjectUtil = require("../../utils/subjectUtil.js");
// var Bmob = require('../../utils/bmob.js');
// pages/main/main.js
var app = getApp();
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    hidden: false,
    show: false,
    start: 1,
    count: 10
  },
  onLoad:function(e){
    this.judgeNetworkType();
    this.loadMovie();

    wx.cloud.database().collection("swiper_img").get().then(res => {
      let adImgUrlArr = new Array();
      for(var i = 0; i < res.data.length; i++) {
        adImgUrlArr = adImgUrlArr.concat(res.data[i].id_url);
      }
      this.setData({
        imgUrls: adImgUrlArr,
      });
    });
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
      url: 'https://douban.uieee.com/v2/movie/in_theaters?count=' + page.data.count,
      data: {movies:[]},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'json'
      }, // 设置请求的 header
      success: function(res){
        var subjects=res.data.subjects;
        subjectUtil.processSubjects(subjects);
        //为搜索页面临时展示
        wx.setStorageSync('initMovies', subjects);
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
      url: 'https://douban.uieee.com/v2/movie/in_theaters?count=' + page.data.count + '&start=' + page.data.start,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'Content-Type': 'json'}, // 设置请求的 header
      success: function(res){
        // success
        var subjects = res.data.subjects;
        subjectUtil.processSubjects(subjects);
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
  toOtherApp:function(event) {
    var that = this;
    var imgId = event.target.dataset.postid; 

    wx.cloud.database().collection("swiper_img").get().then(res => {
      for(let i = 0; i < res.data.length; i++) {
        if(imgId == res.data[i].id_url.id) {
          wx.navigateToMiniProgram({
            appId: res.data[i].appid,
            // path: 'page/index/index?id=123',
            extraData: {
              foo: 'bar'
            },
            envVersion: 'release',
            success(res) {
              // 打开成功
              console.log("跳转成功");
            }
          });
        }
      }
    });
  },
  // hiddenAd:function() {
  //   var that = this;
  //   that.setData({
  //     show: 'true'
  //   });
  // },
   onShareAppMessage: function(){
     return {
       title: '热映电影',
       desc: '我正在看热映的电影，你也一起来呀！',
       path: '/pages/main/main'
     }
   }
})