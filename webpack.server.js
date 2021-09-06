const webpack = require("webpack");
const HtmlwebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const _externals = require("externals-dependencies");

module.exports = {
  mode: "production",
  entry: { server: "./server/server.js" },
  target: "node",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    // libraryTarget: "commonjs2",
  },
  resolve: {
    extensions: ["", ".js"],
  },
  node: {
    __dirname: true,
  },
  externals: _externals(),
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./server/views", to: "views" },
        { from: "./server/static", to: "static" },
      ],
    }),

    // new webpack.optimize.UglifyJsPlugin()
  ],
};
