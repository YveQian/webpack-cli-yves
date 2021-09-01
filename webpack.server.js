const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path');
let externals = _externals();

module.exports = {
    mode:'production',
    entry: {server: './server.js',},
    target: 'node',
    output: {
        path: path.resolve(__dirname,'build'),filename: '[name].js'
    },
    resolve: {
        extensions: ['','.js']

    },
    externals: externals,
    module: {
    // loaders: [

    // {
    // test: /.js$/,loader: 'babel',exclude: /node_modules/

    // }

    // ]

    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
            { from: './views', to: 'views' }
            ],
        }),
    // new webpack.optimize.UglifyJsPlugin()

    ]

};

function _externals() {
    let manifest = require('./package.json');

    let dependencies = manifest.dependencies;

    let externals = {};

    for (let p in dependencies) {
    externals[p] = 'commonjs ' + p;

    }

    return externals;

}
