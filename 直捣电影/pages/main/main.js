var subjectUtil = require("../../utils/subjectUtil.js");
var Bmob = require('../../utils/bmob.js');
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
    
    var that = this;
    var miniProgram = Bmob.Object.extend("more_MiniProgram");
    var query = new Bmob.Query(miniProgram);
    query.find({
      success: function (results) {
        // console.log(results[0].get("adImgUrl"));
        var adImgUrlArr = new Array();
        for(var i=0; i<results.length; i++) {
          adImgUrlArr = adImgUrlArr.concat(results[i].get("id_url"));
        }
        // console.log(adImgUrlArr);
        that.setData({
          imgUrls: adImgUrlArr
        });
      },
      error: function (error) {
        console.log("查询失败" + error.code + " " + error.message);
      }
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
  toOtherApp:function(event) {
    var that = this;
    var imgId = event.target.dataset.postid; 
    // console.log(event.target.dataset.postid);
    var miniProgram = Bmob.Object.extend("more_MiniProgram");
    var query = new Bmob.Query(miniProgram);
    query.find({
      success: function (results) {
        // console.log(results[0].get("adImgUrl"));
        // var adImgUrlArr = new Array();
        for (var i = 0; i < results.length; i++) {
          if (imgId == results[i].get("id_url").id){
            wx.navigateToMiniProgram({
              appId: results[i].get("appid"),
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
        }
        
      },
      error: function (error) {
        console.log("查询失败" + error.code + " " + error.message);
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