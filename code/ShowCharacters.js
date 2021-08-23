
var http = require("lib/httpCall.js")
module.exports.function = function showMovieInfo (movie, action) {
  // 형태: GetMovieDetail(movie, chkActor, chkRating, chkPoster_Plot)
  var chkActor = true
  var chkRating = false
  var chkPoster_Plot = true
  var chkPreview = false
  var movie_detail = http.movieDetail(String(movie), chkActor, chkRating, chkPoster_Plot, chkPreview)
  
  
  return movie_detail
}

