WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其转换和打包为合适的格式供浏览器使用。

Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个（或多个）浏览器可识别的JavaScript文件。


# Webpack4升级


## 一、Node版本依赖重新调整

官方不再支持node4以下的版本，依赖node的环境版本>=6.11.5，当然考虑到最佳的es6特性实现，建议node版本可以升级到V8.9.4或以上版本，具体更新说明部分可以见：[webpack4更新日志](https://github.com/webpack/webpack/releases/tag/v4.0.0)

```javascript
"engines": {
    "node": ">=6.11.5" // >=8.9.4 (recommendation version) 
  }
```


## 二、用更加快捷的mode模式来优化配置文件

webpack4中提供的mode有两个值：development和production，默认值是 production。mode是我们为减小生产环境构建体积以及节约开发环境的构建时间提供的一种优化方案，提供对应的构建参数项的默认开启或关闭，降低配置成本。

### 开启方式 1：直接在启动命令后加入参数

```javascript
"scripts": {
  "dev": "webpack --mode development",
  "build": "webpack --mode production"
}
```

### 开启方式 2：可以在配置文件中加入一个mode属性：

```javascript
module.exports = {
  mode: 'production' // development
};
```

### development模式下，将侧重于功能调试和优化开发体验，包含如下内容：
> 1. 浏览器调试工具
> 2. 注释、开发阶段的详细错误日志和提示
> 3. 快速和优化的增量构建机制

### production模式下，将侧重于模块体积优化和线上部署，包含如下内容：
> 1. 开启所有的优化代码
> 2. 更小的bundle大小
> 3. 去除掉只在开发阶段运行的代码
> 4. Scope hoisting和Tree-shaking
> 5. 自动启用uglifyjs对代码进行压缩

webpack一直以来最饱受诟病的就是其配置门槛极高，配置内容复杂而繁琐，容易让人从入门到放弃，而它的后起之秀如rollup，parcel等均在配置流程上做了极大的优化，做到开箱即用，webpack在V4中应该也从中借鉴了不少经验来提升自身的配置效率，详见内容可以参考这篇文章[《webpack 4: mode and optimization》](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a)


## 三、再见commonchunk，你好optimization

从webpack4开始官方移除了commonchunk插件，改用了optimization属性进行更加灵活的配置，这也应该是从V3升级到V4的代码修改过程中最为复杂的一部分，下面的代码即是optimize.splitChunks 中的一些配置参考，

```javascript
module.exports = {
  optimization: {
    // runtimeChunk: true, //通过设置 optimization.runtimeChunk: true 来为每一个入口默认添加一个只包含 runtime 的 chunk。
    minimizer: true, // [new UglifyJsPlugin({...})]
    splitChunks:{
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        default:false, // 禁用默认
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },
        styles: {
          name: 'styles',
          test: /\.(scss|css)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
  }
}
```

### 从中我们不难发现，其主要变化有如下几个方面：

> 1. commonchunk配置项被彻底去掉，之前需要通过配置两次new webpack.optimize.CommonsChunkPlugin来分别获取vendor和manifest的通用chunk方式已经做了整合，** 直接在optimization中配置runtimeChunk和splitChunks即可 ** ，提取功能也更为强大，具体配置见：[splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks)

> 2. runtimeChunk可以配置成true，single或者对象，用自动计算当前构建的一些基础chunk信息，类似之前版本中的manifest信息获取方式。runtimeChunk: true 来为每一个入口默认添加一个只包含 runtime 的 chunk。

> 3. webpack.optimize.UglifyJsPlugin现在也不需要了，只需要使用optimization.minimize为true就行，production mode下面自动为true，当然如果想使用第三方的压缩插件也可以在optimization.minimizer的数组列表中进行配置

## 四、ExtractTextWebpackPlugin调整，建议选用新的CSS文件提取插件mini-css-extract-plugin

由于webpack4以后对css模块支持的逐步完善和commonchunk插件的移除，在处理css文件提取的计算方式上也做了些调整，之前我们首选使用的[extract-text-webpack-plugin](https://github.com/webpack-contrib/extract-text-webpack-plugin)也完成了其历史使命，将让位于[mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin)

### 基本配置如下：

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,  // replace ExtractTextPlugin.extract({..})
          "css-loader"
        ]
      }
    ]
  }
}
```

### 生产环境下的配置优化：

```javascript
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true 
      }),
      new OptimizeCSSAssetsPlugin({})  // 压缩css 代码
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/app.[name].css',
      chunkFilename: 'css/app.[contenthash:12].css'  // use contenthash *
    })
  ]
  ....
}

```

### 将多个css chunk合并成一个css文件

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {			
          name: 'styles',
          test: /\.scss|css$/,
          chunks: 'all',	// merge all the css chunk to one file
          enforce: true
        }
      }
    }
  }
}
```


## 五、其他调整项备忘

> 1. NoEmitOnErrorsPlugin- > optimization.noEmitOnErrors（默认情况下处于生产模式） 
> 2. ModuleConcatenationPlugin- > optimization.concatenateModules（默认情况下处于生产模式） 
> 3. NamedModulesPlugin- > optimization.namedModules（在开发模式下默认开启） 
> 4. CommonsChunkPlugin 被删除 - > optimization.splitChunks
> 5. webpack命令优化 -> 发布了独立的 [webpack-cli](https://webpack.js.org/api/cli/) 命令行工具包
> 6. webpack-dev-server -> 建议升级到最新版本
> 7. html-webpack-plugin -> 建议升级到的最新版本
> 8. file-loader -> 建议升级到最新版本
> 9. url-loader -> 建议升级到最新版本


# 四个核心概念
## 入口(entry)
```
module.exports = {
  entry: './src/index.js'
};
<!--或者-->
module.exports = {
  entry:{
      app: './src/index.js',
      vender:[
       "react",
       "react-dom",
       "react-router"
      ]
  }
};
```
## 输出(output)
`__dirname` 是node.js中的一个全局变量，它指向当前执行脚本所在的目录

[path.resolve方法用于将相对路径转为绝对路径。](http://javascript.ruanyifeng.com/nodejs/path.html#toc1)

```
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```
## loader
loader 让 webpack 能够去处理那些非 JavaScript 文件

配置项：`text`、`use`
```
module: {
    rules:[
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
        },
        {
            test: /\.css$/, // 必须满足的条件
            // 可以是正则表达式，可以是绝对路径的字符串，还可以是个函数，数组
            // exclude: path.resolve(__dirname,'node_modules'),  //  表示哪些目录中的文件不要进行 loader处理
            // include: path.resolve(__dirname,'src'),  //  表示哪些目录中的文件需要进行loader处理
            // 最佳实践：
            // - 只在 test 和 文件名匹配 中使用正则表达式
            // - 在 include 和 exclude 中使用绝对路径数组
            // - 尽量避免 exclude，更倾向于使用 include

            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                  localIdentName: '[name]__[local]_[hash:base64:5]',
                },
              }
            ]
      },
    ]
}
```
## 插件(plugins)
扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情。

插件变化 webpack4删除了`CommonsChunkPlugin`插件，它使用内置API `optimization.splitChunks` 和 `optimization.runtimeChunk`，即webpack会默认为你生成共享的代码块。
```
  plugins: [
    // 清除 dist 目录
    new CleanWebpackPlugin(['dist']),
    // 单独打包css 文件
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new HtmlWebpackPlugin({
      // 如果配置此项 需要在HTML模板中的title标签中增加   <%= htmlWebpackPlugin.options.title %>
      title: 'Webpack4',
      hash:true,
      template: './src/www/index.html',
      filename: 'index.html'
    }),
  ]
```
##  mode 

不需要手动 `new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") })`

**development**： 会将 `process.env.NODE_ENV` 的值设为 `development`。启用`NamedChunksPlugin` 和 `NamedModulesPlugin`。

- .浏览器调试工具
- .注释、开发阶段的详细错误日志和提示
- .快速和优化的增量构建机制

> NamedModulesPlugin 当开启 HMR 的时候使用该插件会显示模块的相对路径

**production**：会将 `process.env.NODE_ENV` 的值设为 `production`。启用 `UglifyJsPlugin` 等一系列插件。

- .开启所有的优化代码
- .更小的bundle大小
- .去除掉只在开发阶段运行的代码
- .`Scope hoisting`和`Tree-shaking`

> UglifyJsPlugin 压缩JS代码


```
module.exports = {
  mode: 'production'
}
或者
"scripts": {
   "build": "webpack --mode development",
   "dev": "webpack-dev-server --open --mode development"
},
```


## 提取公共代码
webpack4 之前 使用`CommonsChunk` ,webpack4 使用`optimization.splitChunks`
#### CommonsChunk
http://www.css88.com/doc/webpack2/plugins/commons-chunk-plugin/?q=

使用
new webpack.optimize.CommonsChunkPlugin(options)
```
entry: {
  vendor: ["react", "react-dom",'react-router'],
  app: "./src/index"
}

new webpack.optimize.CommonsChunkPlugin({
  // ( 公共chunk(commnons chunk) 的名称)
  name: "vender",

  // 起一个名称
  filename: "commons.js",

   minChunks: 3,
  // (模块必须被3个 入口chunk 共享)
  
   minChunks: Infinity,
  // 随着 入口chunk 越来越多，这个配置保证没其它的模块会打包进 公共chunk
})
```



#### `SplitChunksPlugin`

开箱即用
webpack将根据以下条件自动拆分块：

1、可以共享新块或来自该node_modules文件夹的模块

2、新块将大于30kb（在min + gz之前）

3、根据需要加载块时的最大并行请求数将小于或等于5

4、初始页面加载时的最大并行请求数将小于或等于3

http://imweb.io/topic/5b66dd601402769b60847149

如果想进一步优化 使用 `ptimization.splitChunks` 
```
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: 'async', // chunks: 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async
      minSize: 30000, // minSize: 表示在压缩前的最小模块大小
      maxSize: 0,  // 表示文件在压缩前的最大大小，默认为 0，表示不限制最大大小
      minChunks: 1, // 表示被引用次数，默认为1
      maxAsyncRequests: 5, // 最大的按需(异步)加载次数，默认为5
      maxInitialRequests: 3,  //  最大的初始化加载次数，默认为3；
      automaticNameDelimiter: '~', // 默认情况下，webpack将使用块的名称和名称生成名称（例如vendors~main.js）。此选项允许您指定用于生成的名称的分隔符。
      name: true, // 拆分块的名称。提供true将基于块和缓存组密钥自动生成名称
      // 缓存组也有默认的配置；缓存组默认将node_modules中的模块拆分到一个叫做vendors的代码块中，将最少重复引用两次的模块放入default中
      cacheGroups: {  // 缓存组的默认配置 （这才是配置的关键）
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20, // 默认组的优先级为负，以允许自定义组采用更高的优先级
          reuseExistingChunk: true
        }
      }
    }
  }
};
```
默认配置只会作用于异步加载的代码块，它限制了分离文件的最小体积，即30KB（注意这个体积是压缩之前的），这个是前提条件，然后它有两个分组：属于node_modules模块，或者被至少2个入口文件引用，它才会被打包成独立的文件。

为什么要限制最小体积呢？因为webpack认为小于30KB的代码块分离出来，还要额外消耗一次请求去加载它，成本太高.

上面是缓存组的默认配置，可以通过`default:false`禁用默认的缓存组，然后就可以自定义缓存组，将初始化加载时被重复引用的模块进行拆分

```
cacheGroups: {
    default:false,
    commons: {
        name: "commons",
        chunks: "initial",
        minChunks: 2,
        reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
    }
}

```


稳妥的方式
```
splitChunks: {
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      name: 'vendors',
      minSize: 30000,
      minChunks: 1,
      chunks: 'initial',
      priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
    },
    commons: {
      test: /[\\/]src[\\/]component[\\/]/,
      name: 'commons',
      minSize: 30000,
      minChunks: 1,
      chunks: 'initial',
      priority: -1,
      reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
    }
  }
}
```
首先是将node_modules的模块分离出来，这点就不再累述了。异步加载的模块将会继承默认配置，这里我们就不需要二次配置了。

第二点是分离出共享模块，笔者认为一个优雅的项目结构，其公共代码（或者称为可复用的代码）应该是放置于同一个根目录下的，基于这点我们可以将src/component中的公用代码提取出来。

当然你还可以有另外一种选择，将后缀为.js且使用次数超过2次的文件提取出来，但是不建议这个做，因为这不利于持久化缓存，新增或删除文件都有可能影响到使用次数，从而导致原先的公共文件失效。

####  `runtimechunk`

https://juejin.im/post/5b07d02a6fb9a07aa213c9bc#heading-3



## Dll
前端项目构建过程中，为了提高构建效率，用上cache，往往会将第三方库和自己的业务逻辑代码分开打包，在Webpack里有两个插件可以完成这项任务，CommonsChunk和DLL & DllReference

- CommonsChunk 在webpack4 中已经废弃 使用 optimization.splitChunks
- DLL 通过前置这些依赖包的构建，来提高真正的 build 和 rebuild 的构建效率。也就是说只要第三方库没有变化，之后的每次build都只需要去打包自己的业务代码.

使用：单独新建dll 的config 文件 ，
```
const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    vendors: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-router'
    ]
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(process.cwd(), 'dist'),
    library
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/vendors-manifest.json'),
      // This must match the output.library option above
      name: library
    }),
    new AssetsPlugin({
      filename: 'bundle-config.json',
      // path: path.resolve(process.cwd(), 'dist'),
    }),
  ],
}
```


prod config  中
在 plugins 属性中添加 DllReferencePlugin 插件，并指明 manifest.json 文件的引用路径。
```
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./dist/vendors-manifest.json')
    }),
    
    new HtmlWebpackPlugin({
     ……
      // 使用 AssetsPlugin 打包生成的 json文件
      // bundleName: bundleConfig.vendors.js,
      // 需要将dll 文件链接到html 中
      vendorsName: 'vendors.dll.js',
    }),

```

```
// index.html
    <script type="text/javascript" src="<%=htmlWebpackPlugin.options.vendorsName%>">

```
contenthash