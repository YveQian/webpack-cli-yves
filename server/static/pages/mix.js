
var MixPage_index ={
        data:{
            recordData:{
                after_this_id:1,
                article_offset:1,
                question_offset:10
            }
        },
        MixPage:function(type,data2){
            if(data2){
                return this.request_data(JSON.parse(data2))
            }
            this.request_data(this.data.recordData)
        },
        request_data:function(params){
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
                this.data.recordData = {
                    after_this_id:res.result.after_this_id,
                    article_offset:res.result.article_offset,
                    question_offset:res.result.question_offset
                }
            })
        }
    
    }

