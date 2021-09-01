const Koa = require('koa');
const views = require('koa-views');
const Router = require('koa-router'); 
const ejs = require('ejs');
const http = require('http');
const path = require('path');
const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const registerRouter  = require('./routes');

//实例化
const app = new Koa();
const router=new Router();
const static = require("koa-static");
const staticPath = './static';
app.use(static(path.join( __dirname,  staticPath)))
//配置路由 

router.get('/', async (ctx)=> {
    ctx.body="首页";//返回数据  原生里面的res.send()
})
app.use(async (ctx,next)=> {
  console.log('1.这是第一个中间件01')
  if (ctx.url.startsWith('/api')) { //匹配有api字段的请求url
    ctx.respond = false 
     await k2c(httpProxy.createProxyMiddleware({
     target: 'https://dev-api.sinanbao.com/v1', 
     changeOrigin: true,
     secure: false,
     pathRewrite: {
     '^/api': ''
         }
     }
     ))(ctx,next);
 }
  await next();

  console.log('5.匹配路由完成以后又会返回来执行中间件')
}); 

app.use(async (ctx,next)=> {
  console.log('2.这是第一个中间件02')
  await next();

  console.log('4.匹配路由完成以后又会返回来执行中间件')
  if(ctx.status==404){
    ctx.status = 404;
    ctx.body="这是一个404页面"
  }
})
router.get( '/news', (ctx)=>{
  let url=ctx.url;
//从request中获取GET请求
  let request =ctx.request;
  let req_query=request.query;
  let req_querystring=request.querystring;
//从ctx中直接获取
  let ctx_query = ctx.query;   //{id:123,name:123} 获取的对象 推荐
  let ctx_querystring = ctx.querystring;//id=123&name=123 获取的字符串
  ctx.body={
      url,
      req_query,
      req_querystring,
      ctx_query,
      ctx_querystring
  }
});
app.use(views('views',{
  map : {html:'ejs'}
}));
//写一个中间件配置公共的信息
app.use(async (ctx,next)=>{
  ctx.state.userinfo='张三';
  await next();/*继续向下匹配路由*/
})
app.use(registerRouter());

//启动路由
app.use(router.routes()); 

app.use(router.allowedMethods()); 
//这是官方文档的推荐用法，我们可以看到router.allowedMethods()用在了路由匹配router.routes()之后，所以在当所有路由中间件最后调用。 此时根据ctx.status设置response响应头

app.listen(3000,()=>{
    console.log('starting at port 3000' ) ;
});