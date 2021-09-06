const Router = require("koa-router");
import mix from "../controller/mix";
import detail from "../controller/detail";
// console.log(process.env.NODE_ENV, "routes??????????????");
const appRouters = (app) => {
  const router = new Router({
    // prefix: '/test'
  });
  var get_search_data = require("../static/js/request.js");
  router.get("/detail/:id", detail);
  router.get("/mix", mix);

  app.use(router.routes());

  app.use(router.allowedMethods());
  return router;
};
// module.exports = appRouters;
export default appRouters;
