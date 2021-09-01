
const request = require('request');
var FormData = require('form-data');
const qs = require('qs');
const path = require('path');

var get_search_data = function(params,fn) {
	var data = ''
	data = qs.stringify(params);
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
      reslove((JSON.parse(body)))
      // console.log(body,'====================>')
      // 返回的结果和 GET 一样
    })
  })
}

  module.exports = get_search_data