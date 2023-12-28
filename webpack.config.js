var path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

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
  plugins: [new UglifyJSPlugin()],
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'},
      {test: /\.css$/, loader: ['to-string-loader', 'css-loader']},
    ],
  },
  stats: {},
};

module.exports = webpackConfig;
