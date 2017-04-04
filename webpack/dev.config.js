var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var rootFolder = path.join(__dirname, '../');
var webpack = require('webpack');

module.exports = {
  watch: true,
  //context: path.join(rootFolder, 'src'),
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(rootFolder, 'dist/assets'),
    filename: 'index.js',
    publicPath: '/static/'
  },
  resolve: {
    modules: [
      path.join(rootFolder, "src"),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.jsx$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"],
        include: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: "[name]__[local]___[hash:base64:5]"
            }
          }]
        }),
        include: /src/
        //exclude: /src\/components\/Note\/Draft.css/
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      __DEVELOPEMENT__: true
    })
  ],
  node: {
    console: false
  }
};