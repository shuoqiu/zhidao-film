function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function processSubject(subject){
    //电影标题
    var title= subject.title;
    
    //电影导演
    var directors= subject.directors;
      var directorStr="";
      for(var index in directors){
        directorStr = directorStr + directors[index].name + " /";
      }
      if(directorStr != ""){
        directorStr = directorStr.substring(0, directorStr.length-2);
      }

      //电影演员
      var casts = subject.casts;
      var castStr = "";
      for(var index in casts){
        castStr = castStr + casts[index].name + " /";
      }
      if(castStr != ""){
        castStr = castStr.substring(0, castStr.length-2);
      }

      //电影类型
      var genres = subject.genres;
      var genresStr = "";
      for(var index in genres){
        genresStr = genresStr + genres[index] + " /";
      }
      if(genresStr != ""){
        genresStr = genresStr.substring(0, genresStr.length-2);
      }

      //发行年份
      var year = subject.year;

      //电影ID
      var id = subject.id;

      //电影详情简介
      var summary = subject.summary;

      //演员剧照
      // var castPhoto = subject.casts.avatars.medium;

      var wrap = "\n";
      var text = "名称: " + title + wrap + "导演: " + directorStr + wrap + "演员: " + castStr + wrap + "类型: " + genresStr + wrap + "上映时间: " + year;
      subject.text = text;
  }


function processSubjects(subjects){
    for(var i=0; i<subjects.length; i++){
      var subject=subjects[i];
      this.processSubject(subject);
    }
  }



module.exports = {
  formatTime: formatTime,
  processSubject: processSubject,
  processSubjects: processSubjects
}


