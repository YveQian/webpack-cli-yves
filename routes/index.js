const Router = require("koa-router");
import mix from "../controller/mix";
import detail from "../controller/detail";

const appRouters = (app) => {
  const router = new Router({
    // prefix: '/test'
  });
  router.get("/detail/:id", detail);
  router.get("/mix", mix);

  app.use(router.routes());

  app.use(router.allowedMethods());
  return router;
};
// module.exports = appRouters;
export default appRouters;
