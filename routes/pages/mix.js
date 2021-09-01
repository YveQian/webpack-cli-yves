const Router = require('koa-router')

const router = new Router()
const request = require('request');
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
router.get('/mix',async (ctx)=>{

    let header="司南保";
    const data = await get_search_data({
      data:{
        'article_offset': 1,
        'question_offset': 1,
        'page_size': 10,
      },
      url:'https://dev-api.sinanbao.com/v1/content/mix/list'
      })
    console.log(data.result.data,'===>json')
  
    await ctx.render('mix/mix',{
        content:data.result.data,
        header,
        'off_set':{
          'after_this_id':data.result.after_this_id,
          'article_offset':data.result.article_offset,
          'question_offset':data.result.question_offset
        },
        js:'<script src="/js/mix.js"></script>'
    },(erro)=>{
      console.log('erro:',erro)
    })
  })

  module.exports = router