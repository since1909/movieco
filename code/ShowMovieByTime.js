var console = require("console");
var http = require("lib/httpCall.js")

module.exports.function = function showMovieByTime (location, timeFrom, timeTo) {
  var cur_data = null

  if(timeFrom == "지금") cur_data = http.getTheater(location)['CurrentMovieData']
  else{  
      // 시간
    var dates = require("dates")
    var console = require('console')
    let nowTime = new dates.ZonedDateTime.now
    
    nowTime = String(String(nowTime.toString()).split('T')[1]).split('.')[0]
    hour = nowTime.split(':')[0]

    if(timeTo == null) timeTo = null

    if(hour > parseInt(timeTo)) timeTo = String(parseInt(timeTo) + 12)
    if(parseInt(timeFrom) < 10) timeFrom = "0" + timeFrom
    cur_data = http.timeRange(location, timeFrom, timeTo)
  }
  var movie_list = []
  var icon = null
  var logo = null

  console.log("cur_data", cur_data)
  console.log("loc_latitude",location.latitude)

  for(var i=0; i<cur_data.length; i++){
    var data = cur_data[i]['Theater']

    if(String(data['Name']).indexOf("롯데시네마") != -1){ 
      icon = "/images/icons/Lotte_marker.png"
      logo = "/images/icons/Lotte_logo.png"
    }
    else if(String(data['Name']).indexOf("CGV") != -1){
      icon = "/images/icons/CGV_marker.png"
      logo = "/images/icons/CGV_logo.png"
    }
    else if(String(data['Name']).indexOf("메가박스") != -1){
      icon = "/images/icons/Mega_marker.png"
      logo = "/images/icons/Mega_logo.png"
    }
    
    movie_list.push({ 
      cinemaName : data['Name'],
      cinemaLoca : { latitude: data['Latitude'], longitude : data['Longitude'] },
      distance : dist,
      icon : icon,
      logo : logo
    })
  }
  var movie_detail = http.movieDetail()
  console.log("movie", movie_list)
  return 
}

