var console = require("console");
var http = require("lib/httpCall.js")

module.exports.function = function showBoxOffice (action) {
  var boxOffice = http.boxOffice()
  return boxOffice
}
