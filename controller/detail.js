const get_search_data = require("../static/js/request.js");
const detail = async function (ctx, next) {
  let header = "司南保";
  // console.log(ctx.params.id,'................')
  const data = await get_search_data({
    data: {
      article_id: ctx.params.id,
    },
    url: "https://dev-api.sinanbao.com/v1/content/article/detail",
  });
  console.log(data.result.data, "===>json");

  await ctx.render(
    "detail/index",
    {
      content: data.result.data,
      header,
      js: '<script src="/js/mix.js"></script>',
    },
    (erro) => {
      console.log("erro:", erro);
    }
  );
  next();
};
export default detail;
// module.exports = detail;
