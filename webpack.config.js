var path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

var webpackConfig = {
  mode: 'production',
  entry: {
    radialgauge: './src/viz_gauge.js',
  },
  devServer: {
    contentBase: './dist',
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname,'/dist'),
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.join(__dirname, '../src'), 'node_modules'],
  },
  plugins: [new TerserPlugin()],
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: {loader: 'babel-loader'}},
      {test: /\.css$/, use: [{loader: 'to-string-loader'}, {loader: 'css-loader'}]},
    ],
  },
  stats: {},
};

module.exports = webpackConfig;
