var console = require("console");
var http = require("lib/httpCall.js")
module.exports.function = function showMovieInfo (movie, action) {
  // 형태: GetMovieDetail(movie, chkActor, chkRating, chkPoster_Plot)
  /*
      Detail(모두 False) - "director(감독)", "movieNm(영화이름)", "openDt(개봉날짜)", "genreAlt(장르)"
      chkActor(True) - "actors(배우 사진 및 이름)"
      chkRating(True) - "rate(평점)"
      chkPoster_Plot - "poster(포스터 사진)", "plot(줄거리)"
  */
  var chkActor = true
  var chkRating = true
  var chkPoster_Plot = true
  var chkPreview = true
  var movie_detail = http.movieDetail(String(movie), chkActor, chkRating, chkPoster_Plot, chkPreview)
  // 시간
  var dates = require("dates")
  let nowDate = new dates.ZonedDateTime.now;
  let nowTime = null
  
  nowTime = String(String(nowDate.toString()).split('T')[1]).split('.')[0]
  nowDate = String(nowDate.toString()).split('T')[0]

  //console.log("detail", movie_detail)
  
  console.log("time", nowDate + "!" + nowTime)
  //http.getTheater(37.5, 126.844)

  // 배우가 출연한 영화목록
  // var s = http.actorInfo(String("이병헌"))
  // console.log("actor",s)

  return  movie_detail
            // http.movieDetail(String("곡성"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("광해"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("부산행"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("스물"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("스타워즈"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("아이언맨3"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("어벤져스"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("백두산"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("국가부도의 날"), chkActor, chkRating, chkPoster_Plot),
            // http.movieDetail(String("변호인"), chkActor, chkRating, chkPoster_Plot)
        

}
