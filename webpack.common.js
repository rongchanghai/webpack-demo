const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const bundleConfig = require("./bundle-config.json");

  module.exports = {
    entry: {
      app: path.resolve(__dirname, 'src', 'index.js'),
      vendor: [
        'react',
        'react-dom',
        'react-router',
        'react-router-dom',
        'lodash'
      ]
    },
    resolve: {
      extensions: [".js", ".jsx", ".css", ".less", ".json"],
      alias: {
        $component: './src/component',
      },
    },
    // 基础目录，绝对路径，用于从配置中解析入口起点(entry point) 和 loader
    context: path.resolve(__dirname),
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|svgz)(\?.+)?$/,
          include: path.join(__dirname, './src'),
          exclude: /node_modules/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000
              }
            },
            'file-loader',
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: 'file-loader'
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'async', 
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        // 如果配置此项 需要在HTML模板中的title标签中增加   <%= htmlWebpackPlugin.options.title %>
        title: 'Webpack4',
        hash: true, //防止缓存
        template: './src/www/index.html',
        filename: 'index.html',
      }),
    ],

  };
