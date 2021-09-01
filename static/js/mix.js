
function MixPage(data,data2){
    console.log(data2,'pages') 
    let params = {
        after_this_id:JSON.parse(data2).after_this_id,
        article_offset:JSON.parse(data2).article_offset,
        question_offset:JSON.parse(data2).question_offset
    }
    window.$ajax.post("/api/content/mix/list",params).then((res)=>{
        let li_ = '';
        res.result.data.forEach((item,index)=>{
            if(item.title_img_cos_key){
                li_+=`<li>
                <h2>${item.title}</h2>
                <div>${item.content}</div>
                </li>`
            }else{
                li_+=`<li>
                <h2>${item.title}</h2>
                <div>${item.detail}</div>
                </li>`
            }

        })
        $('#MixPage').append(li_)
    })
}
