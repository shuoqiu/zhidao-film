var subjectUtil=require("../../utils/subjectUtil.js");
// pages/search/search.js
Page({
  data:{
    placeholder: '请输入要查找的电影/演员/导演',
    color: 'gray',
    maxlength: -1,
    inputValue: '',
    movies: [],
    count: 10,
    start: 1
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: "搜索电影"
    });
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
  bindInputKey:function(e){
    var page = this;
    this.setData({
      inputValue:e.detail.value
    });  
    },
    searchMovies:function(){
      var page = this;
      if(this.data.inputValue != ""){
        wx.showNavigationBarLoading();
        var name = page.data.inputValue;
        wx.request({
          url: 'https://api.douban.com/v2/movie/search?q='+name+'&count='+page.data.count,
          data: {},
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {'Content-Type':'json'}, // 设置请求的 header
          success: function(res){
            if(res.data.total == 0){
              wx.showToast({
                title: "没有搜到",
                icon: "success",
                duration: 1500
              });
            }
            var subjects = res.data.subjects;
            subjectUtil.processSubjects(subjects);
            page.setData({
              movies: subjects
            });
            wx.hideNavigationBarLoading();
            wx.setStorageSync('movies', subjects);
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      }else{
        wx.showToast({
          title: '不能为空',
          icon: 'success',
          duration: 2000
        });
      }
    },
    detail:function(e){
      getApp().detail(e);
    },
    onReachBottom:function(){
      wx.showNavigationBarLoading();
      var page = this;
      var start = page.data.start + page.data.count;
      page.setData({
        start: start
      });
      wx.request({
        url: 'https://api.douban.com/v2/movie/search?q='+page.data.inputValue+'&count='+page.data.count + '&start='+page.data.start,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'Content-Type': 'json'}, // 设置请求的 header
        success: function(res){
          // success
          if(page.data.start<=301){
            var subjects = res.data.subjects;
            subjectUtil.processSubjects(subjects);
            var movies = wx.getStorageSync('movies');
            movies = movies.concat(subjects);
            if(subjects.length!=0){
                page.setData({
                  movies: movies
              });
              wx.hideNavigationBarLoading();
            }else{
              wx.hideNavigationBarLoading();
              wx.showToast({
                title: '没内容啦',
                icon: 'success',
                duration: 1500
              });
            //   if(page.data.inputValue == null){
            //     setTimeout(function(){
            //       wx.hideToast();
            //     },0)
            // }
            }
            try{
              wx.setStorageSync('movies', movies);
            }catch(e){
              console.warn(e);
            }
            }else{
              wx.hideNavigationBarLoading();
              wx.showToast({
                title: '没内容啦',
                icon: 'success',
                duration: 1500
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
    // },
    // onShareAppMessage: function(){
    //   var page = this;
    //   return {
    //     title: '刚刚搜到的电影',
    //     desc: '这是我搜索到的内容，你也看一下吧！',
    //     path: '/pages/search/search?inputValue=' + page .data.inputValue 
    //   }
     }
})