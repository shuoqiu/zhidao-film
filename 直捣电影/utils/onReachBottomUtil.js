function pullLoad(){
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
            page.setData({
              movies: subjects,
              hidden: true
          });
        }else {
          wx.showToast({
            title: '没内容啦',
            icon: 'success',
            duration: 1500
          });
          page.setData({
            hidden: true
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



  module.exports = {
      pullLoad: pullLoad 
  }