const path = require('path')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const DefinePlugin = require('webpack/lib/DefinePlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyESPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const autoprefixer = require('autoprefixer')

module.exports = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    publicPath: '/'
  },

  resolve: {
    mainFields: ['module', 'browser', 'main']
  },

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyESPlugin({
        cache: path.resolve(__dirname, '../webpack_cache'),
        uglifyOptions: {
          output: {
            beautify: false,
            comments: false,
          },
          compress: {
            warnings: false,
            drop_console: true,
            comparisons: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          autoprefixer: { remove: false } // 添加对autoprefixer的配置
        }
      })
    ],
    providedExports: true,
    usedExports: true,

    sideEffects: true,
    concatenateModules: true,

    noEmitOnErrors: true,

    moduleIds: 'hashed',

    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
  },

  module: {
    rules: [{
      oneOf: [{
        test: /\.(le|c)ss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader, }, 'css-loader',
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer(),
              ],
            },
          }, 'less-loader']
      }]
    }]
  },

  plugins: [
    // 配置生产环境的全局变量
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // 生成自动引用文件的html模板
    new HtmlWebpackPlugin({
      template: require.resolve('../index.html'),
      inject: true,
      minify: { // 压缩生成的html
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
      chunkFilename: 'css/[name].[contenthash].css',
      allChunks: true // 将按需加载里的css提取出来
    })
  ]
})
