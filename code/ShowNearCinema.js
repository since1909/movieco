var console = require("console");
var http = require("lib/httpCall.js")

module.exports.function = function showNearCinema (location) {
  var cur_data = http.getTheater(location)['CurrentMovieData']
  var movie_list = []
  var icon = null
  var logo = null

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
      distance : data['Distance'],
      icon : icon,
      logo : logo
    })
    //console.log("data", data)
    //console.log("data['latitude']",data['Latitude'])
  }  
  console.log("movie", movie_list)
  return { location : location, cinema : movie_list }
}
