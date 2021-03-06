"use strict";

var http = require("http");
var stream = require("stream");
var url = require("url");
var zlib = require("zlib");

var noop = function () {};

//两种请求
var transdata = {
    post: function (opt) {
        opt.method = "post";
        main(opt);
    },

    get: function (opt) {
        if (arguments.length >= 2 && (typeof arguments[0] == "string") && (typeof arguments[1] == "function")) {
            opt = {
                url: arguments[0],
                success: arguments[1]
            };

            if (arguments[2] && (typeof arguments[2] == "function")) {
                opt.error = arguments[2];
            }
        }

        opt.method = "get";
        main(opt);
    }
};
function main(opt) {
    var options, creq;

//    res可以为response对象，也可以为一个可写流，success和error为请求成功或失败后的回调
    opt.res = ((opt.res instanceof http.ServerResponse) || (opt.res instanceof stream.Writable)) ? opt.res : null;
    opt.success = (typeof opt.success == "function") ? opt.success : noop;
    opt.error = (typeof opt.error == "function") ? opt.error : noop;

    try {
        opt.url = (typeof opt.url == "string") ? url.parse(opt.url) : null;
    } catch (e) {
        opt.url = null;
    }

    if (!opt.url) {
        opt.error(new Error("url is illegal"));
        return;
    }

    options = {
        hostname: opt.url.hostname,
        port: opt.url.port,
        path: opt.url.pathname,
        method: opt.method,
        headers: {
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,ja;q=0.4,zh-TW;q=0.2',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.37 Safari/537.36'
        }
    };

//  如果req为可读流则使用pipe连接，传输数据，如果不是则直接写出字符串
    if (opt.method == 'post') {
        if (opt.req instanceof stream.Readable) {
            if(opt.req instanceof http.IncomingMessage){
                options.headers["Content-Type"] = opt.req.headers["content-type"];
                options.headers["Content-Length"] = opt.req.headers["content-length"];
            }
            process.nextTick(function () {
                opt.req.pipe(creq);
            })
        } else {
            var str = ((typeof opt.req) == "string") ? opt.req : "";

            process.nextTick(function () {
                creq.end(str);
            })
        }
    } else {
        process.nextTick(function () {
            creq.end();
        })
    }

    creq = http.request(options, function (res) {
        reqCallback(opt.res, res, opt.success)
    }).on('error', function (e) {
        opt.error(e);
    });
}
function reqCallback(ores, res, callback) {
    if (ores) {
        ores.on('finish', function () {
            callback();
        });

        if (ores instanceof http.ServerResponse) {
            var options = {};

            //复制响应头信息
            if (res.headers) {
                for (var k in res.headers) {
                    options[k] = res.headers[k];
                }
            }

            ores.writeHead(200, options);
        }

        res.pipe(ores);
    } else {
        var size = 0;
        var chunks = [];

        res.on('data', function (chunk) {
            size += chunk.length;
            chunks.push(chunk);
        }).on('end', function () {
            var buffer = Buffer.concat(chunks, size);

            //如果数据用gzip或者deflate压缩，则用zlib进行解压缩
            if (res.headers && res.headers['content-encoding'] && res.headers['content-encoding'].match(/(\bdeflate\b)|(\bgzip\b)/)) {
                zlib.unzip(buffer, function (err, buffer) {
                    if (!err) {
                        callback(buffer.toString())
                    } else {
                        console.log(err);
                        callback("");
                    }
                });
            } else {
                callback(buffer.toString())
            }
        })
    }
}