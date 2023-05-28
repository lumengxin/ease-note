const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // mode: "development",
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    // compress: true,
    // port: 8000,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  resolve: {
    // webpack 默认只处理js、jsx等js代码
    // 为了防止在import其他ts代码的时候，出现
    // " Can't resolve 'xxx' "的错误，需要特别配置
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)?$/,
        use: [
          'babel-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
        ]
      },
      {
          test: /\.styl$/,
          use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'stylus-loader'
          ]
      }
    ],
  },
}