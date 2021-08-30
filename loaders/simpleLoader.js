
function simpleLoader(content, map, meta) {
    console.log("我是 SimpleLoader");
    console.log(content,'qiaoyixia')
    console.log(typeof content)
    return content;
}
simpleLoader.pitch = function(remainingRequest, precedingRequest, data){
    console.log('开始simpleLoader：',data)
}
  module.exports = simpleLoader;
