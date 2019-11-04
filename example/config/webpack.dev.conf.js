const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin, HotModuleReplacementPlugin, NamedModulesPlugin, NamedChunksPlugin } = require('webpack')
const utils = require('./utils')
const baseWebpackConfig = require('./webpack.base.conf')


module.exports = merge(baseWebpackConfig, {
  optimization: {
    namedModules: true,
    namedChunks: true,
    nodeEnv: 'development',
    splitChunks: {
      hidePathInfo: false,
      minSize: 10000,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
    },
    noEmitOnErrors: false,
    checkWasmTypes: false,
  },

  devtool: 'cheap-module-eval-source-map',

  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 600
  },

  cache: true,

  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    pathinfo: true,
    publicPath: `http://localhost:${utils.port}/`,

  },

  profile: true,

  plugins: [
    new NamedModulesPlugin(),
    new NamedChunksPlugin(),
    new HotModuleReplacementPlugin(),


    // 生成自动引用文件的html模板
    new HtmlWebpackPlugin({
      template: require.resolve('../index.html'),
      inject: true,
    }),

    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ],

  devServer: {
    compress: true,
    port: utils.port,
    allowedHosts: [
      '.52shangou.com'
    ],
    publicPath: `http://localhost:${utils.port}/`,
    clientLogLevel: 'none',
    hot: true,
    stats: {
      all: false,
      modules: false,
      errors: true,
      warnings: true,
      colors: true,
      assets: true,
      timings: true,
    }
  }
})
