const conut = 0;
const name = 'xiaoming&xiaohong&xiaohuang&xiaolu&kkkkkk$lll*ksksdh&sd';
const kkk = 'lskd';
const params = {
  article_offset: 1,
  question_offset: 1,
  page_size: 10,
};
const formData = new FormData();
formData.append('article_offset', 1);
formData.append('question_offset', 1);
formData.append('page_size', 10);
export default function getData(data) {
  console.log(conut);
  console.log(name);
  console.log(kkk);
  console.log(data);
  window.$ajax.post('/api/content/mix/list', params).then((res) => {
    console.log(res);
  });
}
