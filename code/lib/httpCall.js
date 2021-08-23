var console = require('console')

module.exports.movieSimple = function(movie){
  return GetMovieSimple(movie)
}
module.exports.movieDetail = function(movie, chkActor, chkRating, chkPoster_Plot, chkPreview){
  return GetMovieDetail(movie, chkActor, chkRating, chkPoster_Plot, chkPreview)
}
module.exports.getTheater = function(location){
  return NowGetTheater(location)
}
module.exports.actorInfo = function(name){
  var movieList = GetFilmos(name)
  var movieListMax = 0
  var detail_list = []

  if(movieList.length > 6) movieListMax = 6
  else movieListMax = movieList.length
  for(var i=0; i < movieListMax; i++){
      detail_list.push(GetMovieDetail(movieList[i], false, false, true))
  }
  return detail_list
}
module.exports.boxOffice = function(){
  return GetBoxOffice()
}

module.exports.timeRange = function(location, t_from, t_to){
  return GetTimeRange(location, t_from, t_to)
}

// ���2의 키: 7c069ee0c6eca574562d5d2f4565029b	
function GetMovieSimple(movie){
  var http = require('http')
  var request = null
  var link = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json?key=4d7629b2e1a618478b9a62bf65d6db06&movieNm=" + movie

  link = encodeURI(link)

  request = http.getUrl(link, {format : 'json'})
  
  request = request["movieListResult"]

  // 영화를 찾지 못했을 때,
  if(request['totCnt'] == 0) return null
  
  // 영화를 찾았을 때, 맨 처음 영화를 얻어옴
  request = request["movieList"]
  
  movie = String(movie).trim()

  var i = 0
  for(; i < request.length; i++){
    if(request[i].movieNm == movie){
      request = request[i]
      break
    }
  }
  if(request.length == i) request = request[0]
  
  var opendt = String(request.openDt)
  opendt = opendt.substring(0, 4) + "/" + opendt.substring(4,6) + "/" + opendt.substring(6)

  return    {   "movieCd" : request.movieCd,
                "movieNm" : request.movieNm,
                "openDt" : opendt,
                "genreAlt" : request.genreAlt
            }
}

function GetMovieDetail(movie, chkActor, chkRating, chkPoster_Plot, chkPreview){
  var movieInfo = GetMovieSimple(movie)
  if( movieInfo == null ) return null

  var http = require('http')
  var request = []
  var request_profile = null
  
  var etc = null
  var actors_list = null
  var director = null

  var link = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json?key=4d7629b2e1a618478b9a62bf65d6db06&movieCd=" + movieInfo.movieCd
   
  request = http.getUrl(link, {format : 'json'})
  
  request = request["movieInfoResult"]["movieInfo"]
 
  if(chkActor == true) actors_list = GetActors(request)
  if(chkRating == true || chkPoster_Plot == true || chkPreview == true) etc = Etc(request.movieNm, chkRating, chkPoster_Plot, chkPreview)
  if(request['directors'].length != 0) director = request['directors'][0].peopleNm
  return  { "director" : director,
            "movieCd" : request.movieCd,
            "movieNm" : request.movieNm,
            "openDt" : movieInfo.openDt,
            "genreAlt" : movieInfo.genreAlt,
            "actors" : actors_list,
            "poster" : etc.poster,
            "plot" : etc.plot,
            "rate" : etc.rate,
            "preview" : etc.preview,
            "runtime" : request.showTm
         }
}

function GetActors(request){
  var http = require('http')
  var request_profile = null
  var peopleNm = request["actors"]
  var actors_list = []

  // 불러올 배우 수(6명)
  var MAX_ACTOR = 6
  var property = ["peopleNm", "peopleNmEn"]
  for(let i=0; i < MAX_ACTOR; i++){
    if(request["actors"].length < i+1 ) break

    var chk = false
    for(let k=0; k<2; k++){
      link = "https://api.themoviedb.org/3/search/person?api_key=56c33047aea5738cd88488718838554c&language=ko-KR&query="
      link += peopleNm[i][property[k]] + "&page=1&include_adult=true"

      link = encodeURI(link)

      request_profile = http.getUrl(link, {format : "json"})

      // 프로필이 있을 때,
      if(request_profile['total_results'] != 0){
        chk = true
        break
      }
    }
    if(peopleNm.length != MAX_ACTOR && chk == false){
      MAX_ACTOR++; continue 
    }

    var actors = request_profile['results']
    // api를 통한 참여한 영화 목록들을 가져옴

    for(let j=0; j < actors.length; j++){
      // 프로필의 인���이 여러명이 존재할 때, 영어 이름이 일치하면 대입
      var actor_ename = String(actors[j]["name"]).toLowerCase()
      var request_ename = String(peopleNm[i]["peopleNmEn"]).toLowerCase()

      if(actor_ename == request_ename || request["movieNm"] == actors[j].title){
        request_profile = String(actors[j]['profile_path']).substring(1)
        break
      } 
      else request_profile = null
    }
    // 영���이름과 출연한 영화이름이 일치하지 않을 때, 첫번째 배우의 사진을 가져옴
    if(request_profile == null) request_profile = String(actors[0]['profile_path']).substring(1)

    actors_list.push({ name: peopleNm[i]["peopleNm"], link: "https://image.tmdb.org/t/p/w500/" + request_profile})
  }
  return actors_list
}

function GetFilmos(name){
  var http = require('http')
  var request = []
  var result = ""
  var link = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/people/searchPeopleList.json?key=4d7629b2e1a618478b9a62bf65d6db06&peopleNm=" + name
  
  request = http.getUrl(link, {format : 'json'})
  
  if(request["peopleListResult"]["totCnt"] == 0) return null
  request = request["peopleListResult"]["peopleList"]

  for(let i=0; i<request.length; i++){
    // 영화인 api에서 배우 역할을 맡은 사람들만 비교
    if(request[i].repRoleNm == "배우"){
      // // 영화인 상세정보를 참���( 해당하는 무비코드가 있을 경우, 리턴 )
      // var detail_link = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/people/searchPeopleInfo.xml?key=430156241533f1d058c603178cc3ca0e&peopleCd=" + request[i].peopleNm
      // var detail_request = null

      // detail_request = http.getUrl(detail_request, {format : 'json'})['peopleInfoResult']['peopleInfo']['filmos']
      // for(let j=0; j<detail_request.length; j++){
      //   if(detail_request[j].movieCd == movieCd) return true
      // }
      result = request[i].filmoNames
      break
    }
  }
  return String(result).split('|')
}

function Etc(movie, chkRating, chkPoster_Plot, chkPreview){
  var http = require('http')
  var rate = null
  var link_rate = "https://openapi.naver.com/v1/search/movie.json?query="
  var poster_link = null
  var plot_text = null
  var response_trailer = null
  var movieNm = movie

  movie = encodeURI(movie)

  if(chkRating == true){
    link_rate += movie
    let options = {
      format : 'json',

      headers: {
        'X-Naver-Client-Id' : 'NhRjUHNtKKZcrq1OuINw',
        'X-Naver-Client-Secret' : 'UITobiPIfN',
      },
    };
    rate = http.getUrl(link_rate, options)["items"][0]["userRating"]
  }
  
  if(chkPoster_Plot == true){
    var id = null
    var response = null
    var link = "https://api.themoviedb.org/3/search/movie?api_key=56c33047aea5738cd88488718838554c&language=ko-KR&query="
    link += movie + "&page=1&include_adult=True"
    
    response = http.getUrl(link,{format : 'json'})

    if(response['total_results'] != 0){
      var i = 0
      var list_ = []
      var max = -1
      var pt = 0

      response = response['results']
      for(; i<response.length; i++){
          if(movieNm == response[i]['title']){
            list_.push([i, response[i]['id']])
          }
      }
      if(list_.length == 0) response = response[0]
      else{
        for(var j=0; j<list_.length; j++){
          if(max < list_[j][1]){ 
            max = list_[j][1]
            pt = list_[j][0]
          }
        }
        response = response[pt]
      }
      console.log("response",response)

      var keylist = new Object(response)
      if(keylist.hasOwnProperty('poster_path') == true) poster_link = "https://image.tmdb.org/t/p/w500/" + String(response['poster_path']).substring(1)
      if(keylist.hasOwnProperty('overview') == true) plot_text = response['overview']
    }

    
  }

  if(chkPreview == true){
    var trailer_link = encodeURI("http://9aaba38e.ngrok.io/show_trailer/") + movie 

    response_trailer = http.getUrl(trailer_link,{format: 'json'})
    response_trailer = response_trailer['TrailerURL']
  }
  
  // link = "https://api.themoviedb.org/3/movie/" + id + "/videos?api_key=56c33047aea5738cd88488718838554c"
  // response_trailer = http.getUrl(link,{format : 'json'})['results'][0]
  // console.log("response", response_trailer)
  return {
            poster : poster_link,
            plot : plot_text,
            rate : rate,
            preview : response_trailer
         }
}
function GetBoxOffice(){
  var http = require('http')
  var dates = require("dates")
  let boxoffice_list = []
  var request = null

  var link = " http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=4d7629b2e1a618478b9a62bf65d6db06&targetDt="
  let nowDate = new dates.ZonedDateTime.now;
  
  nowDate = String(nowDate.toString()).split('T')[0]
  nowDate = String(nowDate).replace(/-/g,'')
  nowDate = parseInt(nowDate) - 1
  link += String(nowDate)

  request = http.getUrl(link, {format : 'json'})["boxOfficeResult"]["dailyBoxOfficeList"]
  
  console.log("request", request[0]['movieNm'])

  for(let i = 0; i < request.length; i++){
    var movie = GetMovieDetail(request[i]['movieNm'], false, true, true, false)
    console.log("movie",movie)
    movie['movieNm'] = String(i+1) + ". " + movie['movieNm']
    movie['audiAcc'] = request[i]['audiAcc']
    boxoffice_list.push(movie)
  }
  console.log("boxOffice", boxoffice_list)
  return boxoffice_list
}
// 1시간 이내의 주변 극장의 정보들을 가져옴(영화 시간표 / 주소)
// latitude : 위도, longitude : 경도
function NowGetTheater(location){
  var http = require('http')
  var lat = location.latitude
  var long = location.longitude
  var theater_data_link = encodeURI("http://9aaba38e.ngrok.io/get_current_movie/"+ lat + "/" + long) 
  var theater_data = null

  theater_data = http.getUrl(theater_data_link,{format: 'json'})
    //response_trailer = response_trailer.TrailerURL
  console.log("theater_data",theater_data)

  return theater_data
}

function GetTimeRange(location, t_from, t_to){
  var http = require('http')
  var lat = location.latitude
  var long = location.longitude

  if(t_to == null){ 
    t_to = parseInt(t_from) + 1
    if(t_to < 10) t_to = String("0" + t_to)
  }
  var theater_data_link = encodeURI("http://9aaba38e.ngrok.io/get_specific_time_movie/" + lat + "/" + long + "/" + t_from + "/" + t_to)
  var theater_data = null

  theater_data = http.getUrl(theater_data_link,{format: 'json'})
    //response_trailer = response_trailer.TrailerURL

  return theater_data
}