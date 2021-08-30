const express = require('express');
const path = require('path');
const app = express();
const request = require('request');
const fs = require('fs');
const watch = require('node-watch')

let watcher = watch('./dist/', { recursive: true });

watcher.on('change', function(evt, name) {
    console.log('change',name)
    app.use('/', function (req, res) {});
});

watcher.on('error', function(err) {
    console.log('erro',err)
  // handle error
});

watcher.on('ready', function() {
    console.log('ready')
  // the watcher is ready to respond to changes
});

// let serverUrl = 'http://192.168.1.200:8080';//代理server地址
// 配置静态文件服务中间件
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/', function (req, res, next) {
    // routes(req, res, next)
    // //跨域处理
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // //代理接口地址
    // let url = serverUrl + req.url;
    // //用request转发代理
    // req.pipe(request(url)).pipe(res);
});

app.listen(3000, () => {
    console.log(`App listening at port 3000`)
})
