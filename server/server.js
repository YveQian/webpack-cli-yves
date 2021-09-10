import appRouters from './routes';

console.log(
  '=============================',
  process.env.NODE_ENV,
  '=============================',
);
const Koa = require('koa');
const views = require('koa-views');
const Router = require('koa-router');
// const ejs = require('ejs');
// const http = require('http');
const path = require('path');
const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');

const logsUtil = require('../utils/logs.js');

// 实例化
const app = new Koa();
const router = new Router();
const koastatic = require('koa-static');

const staticPath = process.env.NODE_ENV == 'production' ? '../static' : './static';

const viewsPath = process.env.NODE_ENV == 'production' ? '../../build/views' : './views';

app.use(koastatic(path.join(__dirname, staticPath)));

app.use(
  views(path.join(__dirname, viewsPath), {
    map: { html: 'ejs' },
  }),
);
// 配置路由
router.get('/', async (ctx) => {
  ctx.body = '首页'; // 返回数据  原生里面的res.send()
});
app.use(async (ctx, next) => {
  console.log('1.这是第一个中间件01');
  const start = new Date(); // 响应开始时间
  let intervals; // 响应间隔时间
  try {
    if (ctx.url.startsWith('/api')) {
      // 匹配有api字段的请求url
      ctx.respond = false;
      await k2c(
        httpProxy.createProxyMiddleware({
          target: 'https://dev-api.sinanbao.com/v1',
          changeOrigin: true,
          secure: false,
          pathRewrite: {
            '^/api': '',
          },
        }),
      )(ctx, next);
    }
    await next();
    intervals = new Date() - start;
    logsUtil.logResponse(ctx, intervals); // 记录响应日志
  } catch (error) {
    intervals = new Date() - start;
    logsUtil.logError(ctx, error, intervals); // 记录异常日志
  }
  // await next();

  console.log('5.匹配路由完成以后又会返回来执行中间件');
});

app.use(async (ctx, next) => {
  console.log('2.这是第一个中间件02');
  await next();

  console.log('4.匹配路由完成以后又会返回来执行中间件');
  if (ctx.status == 404) {
    ctx.status = 404;
    ctx.body = '这是一个404页面';
  }
});
router.get('/news', (ctx) => {
  const { url } = ctx;
  // 从request中获取GET请求
  const { request } = ctx;
  const req_query = request.query;
  const req_querystring = request.querystring;
  // 从ctx中直接获取
  const ctx_query = ctx.query; // {id:123,name:123} 获取的对象 推荐
  const ctx_querystring = ctx.querystring; // id=123&name=123 获取的字符串
  ctx.body = {
    url,
    req_query,
    req_querystring,
    ctx_query,
    ctx_querystring,
  };
});

// 写一个中间件配置公共的信息
app.use(async (ctx, next) => {
  ctx.state.userinfo = '张三';
  await next(); /* 继续向下匹配路由 */
});

appRouters(app);

// 启动路由
app.use(router.routes());

app.use(router.allowedMethods());

app.listen(3000, () => {
  console.log('starting at port 3000');
});
