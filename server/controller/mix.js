const get_search_data = require("../static/js/request.js");
const mix = async function (ctx, next) {
  let header = "司南保";
  const data = await get_search_data({
    data: {
      article_offset: 1,
      question_offset: 1,
      page_size: 10,
    },
    url: "https://dev-api.sinanbao.com/v1/content/mix/list",
  });
  console.log(data.result.data, "===>json");

  await ctx.render(
    "mix/mix",
    {
      content: data.result.data,
      header,
      off_set: {
        after_this_id: data.result.after_this_id,
        article_offset: data.result.article_offset,
        question_offset: data.result.question_offset,
      },
      js: '<script src="/pages/mix.js"></script>',
    },
    (erro) => {
      console.log("erro:", erro);
    }
  );
  next();
};
export default mix;
// module.exports = mix;
