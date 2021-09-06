
const request = require('request');
var FormData = require('form-data');
const qs = require('qs');
// const path = require('path');

var get_search_data = function(params,fn) {
	var data = ''
	data = qs.stringify(params);
  console.log(params,'????')
	var http_request = {
		url: params.url,
		// port: 80,
    form:params.data,
    headers: {
      'snb-client-type':'web',
      "content-type": "application/json"
    },
	}
  return new Promise((reslove,reject)=>{
    request.post(http_request, function (error ,response, body) {
      console.log(body,'jin')
      reslove((JSON.parse(body)))
    })
  })
}

  module.exports = get_search_data