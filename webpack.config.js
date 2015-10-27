var webpack = require('webpack');

var path = require('path');
var fs = require('fs');
var node_modules = path.resolve(__dirname, 'node_modules');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


var config = {
    entry: [path.resolve(__dirname, 'app/index.js')],
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    module: {
      preLoaders: [
          { test: /\.json$/, loader: 'json'},
      ],
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }]
    },
    externals: nodeModules,
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.json']
    }
};

module.exports = config;
