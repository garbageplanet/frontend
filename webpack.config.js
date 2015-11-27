// webpack.config.js
var webpack = require('webpack')
var path = require('path');

module.exports = {
  entry: ['./src/index.js'],
  resolve: {
    root: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
    extensions: ['', '.js']
  },
  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: 'build.js'
  },

  module: {
    loaders: [
      { test: /\.vue$/, loader: 'vue' },
      { test: /\.sass$/, loader: 'style!css!sass' }, // this might not be setup correctly
      {
        test: /\.js$/,
        exclude: /node_modules|vue\/src|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
        loader: 'babel'
}
    ]
  }
}
