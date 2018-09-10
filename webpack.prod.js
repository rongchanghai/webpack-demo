
const path = require('path');
// 替换 ExtractTextWebapckPlugin  实现 CSS 单独打包
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// autoprefixer解析CSS文件并且添加浏览器前缀到CSS规则里，使用Can I Use的数据来决定哪些前缀是需要的。可删可增
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const commonConfig = require('./webpack.common')

// 自动补齐各浏览器前缀
const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      autoprefixer({
        browsers: ['iOS > 7', 'Android >= 4.0'],
      }),
    ],
  },
};

module.exports = merge(commonConfig, {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[contenthash].js',
    chunkFilename: '[name]_[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local]-[hash:base64:5]',
            },
          },
          postcss
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, //指定css-loader处理前最多可以经过的loader个数   
              modules: true,
              localIdentName: '[name]_[local]-[hash:base64:5]',
            },
          },
          postcss,
          'less-loader'
        ]
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
  plugins: [
    // new CleanWebpackPlugin('dist'),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css'
    }),
  ]
})

