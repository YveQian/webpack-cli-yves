let conut = 0
let name = 'xiaoming&xiaohong&xiaohuang&xiaolu&kkkkkk$lll*ksksdh&sd'
let kkk = 'lskd'
let params = {
    'article_offset':1,
    'question_offset':1,
    'page_size':10
}
let formData = new FormData()
formData.append('article_offset',1)
formData.append('question_offset',1)
formData.append('page_size',10)
export default function getData(){
    window.$ajax.post("/api/content/mix/list",params).then((res)=>{
        console.log(res)
    })
}