const path = require('path')
var HtmlwebpackPlugin = require('html-webpack-plugin');
var globalPlugins = require('./plugins/globalPlugins.js');
var devServerDevelop = require('./plugins/dev.js');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require ('mini-css-extract-plugin');
const ExtractTextPlugin = require ('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const entrys  = require('./entry.js');
const htmlArray = [];

Object.keys(entrys).forEach(element => {
  console.log(element,'element')
    htmlArray.push(new HtmlwebpackPlugin(
      {
        filename:'./'+element+'/'+ 'index.html',
        template: 'src/'+element+'/'+'index.html',    
        title:element,
        inject:'body',
        chunks: [element,'vendor']
      }
    ))
});
const clientConfig = {
    target:'web',
    mode:'none',
    entry: entrys,
    output:{
        filename:'./[name]/[name][hash].js',
        path:path.resolve(__dirname,'dist'),
        // publicPath:'/login/'
    },
    resolve: {
        extensions: ['.js', '.json'], 
        alias: {
            '@': path.join(__dirname, '', "src") // 在项目中使用@符号代替src路径
        }
    },
    module: {
        rules: [
          {
            test: /\.js$/i,
            exclude: /node_modules/,
            use: ["simpleLoader","babel-loader"],
          },
          // {
          //   test: /\.js$/i,
          //   use: ["ignore-console-log-loader"],
          // },
          {
              test: /\.(scss|css)$/i, 
              use: ['style-loader',{
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false,
                    publicPath: "./"
                    // hmr: devMode
                }
            },{
              loader:'css-loader',
              options:{
                importLoaders:2,
                url:false
              }
            }, 'sass-loader']
          },
          {
            test:/\.(jpg|jpeg|png|gif)/,
            use:[
              {
                loader:'file-loader',
                options:{
                  name: './images/[name].[ext]'
                }
              }
            ]
          }
        ]
    },
    plugins:[
        ...htmlArray,
        new MiniCssExtractPlugin({
          filename: `./[name]/[name]_[contenthash:8].css`,
          chunkFilename: `[id].css`
      }),
        new globalPlugins({data:'ceshi'}),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
          patterns: [
            { from: './public/images', to: 'images' },
            { from: './public/fonts', to: 'fonts' },
            { from: './public/libs', to: 'static' }
          ],
        }),

        // new devServerDevelop()
    ],
    externals: {
        jquery: 'jQuery',
        jquery: '$' 
    },
    resolveLoader: {
        modules: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "loaders")
        ]
    }
    ,
    devServer: {
      compress:true,
      host:'0.0.0.0',
      port:7000,
      proxy:{
        '/api':{
          target:'https://dev-api.sinanbao.com/v1',
          changeOrigin: true,
          pathRewrite: {
                '^/api': '/'  //必须这样写
          }
        }
      }
    }
}

module.exports = [clientConfig]