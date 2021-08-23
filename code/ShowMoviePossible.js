var console = require("console");
var http = require("lib/httpCall.js")

module.exports.function = function showMoviePossible (location, movie) {
  var movie_detail = http.movieDetail(movie, false, false, true, false)
  var cur_data = http.getTheater(location)['CurrentMovieData']
  var theater_list = []

  for(let i=0; i<cur_data.length; i++){
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

    var movieInfo = cur_data[i]['Movie']
    var movieTime = null

    for(var name in movieInfo){
      if(movie_detail['movieNm'] == name){
        movieTime =  movieInfo[name]
      }
    }
    theater_list.push(
      { movieTime : movieTime,
        cinema : {data
        logo : logo,
        icon : icon,
      }
    )
  }
  return {
    movieDetail : movie_detail,
    theaterList : theater_list,
    location : location  
  }

}
