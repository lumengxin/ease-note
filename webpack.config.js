const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const basePlugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "ease-note.css",
    // chunkFilename: "[id].css"
  })
]

const isComponent = process.env.NODE_ENV === "component"
const entry =  isComponent ? "./src/output.tsx" : "./src/index.js"
const output = isComponent ? {
  path: path.resolve(__dirname, 'lib'),
  library: 'ease-note', // 指定的就是你使用require时的模块名
  libraryTarget: 'umd',
  filename: 'ease-note.js',
  umdNamedDefine: true, // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  globalObject: 'this',
} : { path: path.resolve(__dirname, 'dist'), }
const plugins = isComponent ? basePlugins : [
  new HtmlWebpackPlugin({
    template: './public/index.html'
  }),
  ...basePlugins
]

module.exports = {
  // mode: "development",
  devtool: 'source-map',
  entry,
  output,
  plugins,
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    port: 8000,
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
          'babel-loader',
          // {
          //   loader: 'ts-loader',
          //   options: {
          //     transpileOnly: true,
          //   },
          // }
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
  externals: {
    'react': {
      commonjs: 'react', // CommonJS 模块
      commonjs2: 'react', // CommonJS 模块
      amd: 'react',       // AMD 模块
      root: 'React',     // 全局变量访问
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
  }
}