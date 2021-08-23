var http = require("lib/httpCall.js")
module.exports.function = function showMovieTrailer (movie, action) {
  // 형태: GetMovieDetail(movie, chkActor, chkRating, chkPoster_Plot)
  var chkActor = false
  var chkRating = false
  var chkPoster_Plot = true
  var chkPreview = true
  var movie_detail = http.movieDetail(String(movie), chkActor, chkRating, chkPoster_Plot, chkPreview)

  return movie_detail
}