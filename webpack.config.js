/*
 * @Author: xiongsheng
 * @Date:   2016-08-18 12:37:48
 * @Last Modified by:   xiongsheng
 * @Last Modified time: 2016-11-01 16:27:48
 */
var webpack = require("webpack"),
    path = require('path'),
    AssetsPlugin = require('assets-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var src = path.resolve(__dirname, './src'); // 源码目录

var mockport, hashType, devtool;
//开发环境和上线环境需要区分
if (process.env.NODE_ENV === 'production') {
    //上线环境
    // 配置2：hasType
    // 在上线环境使用chunkhash
    hashType = 'chunkhash';
    // 配置3：devtool
    // 在上线环境中，devtool为空值
    devtool = '';
} else { //其他都是开发环境

    //配置1：mockport
    //bizdp在启动webpack-dev-server时会默认把bizmock监听的随机端口号从命令行中传递过来
    //eg:webpack-dev-server --mockport 8888
    process.argv.forEach(function(val, index) {
        if (val === '--mockport') {
            mockport = process.argv[index + 1];
            return false;
        }
    });

    //配置2：hasType
    // 在开发环境中要使用hash代替chunkhash
    // webpack-dev-server不支持chunkhash
    hashType = 'hash';
    // 配置3：devtool
    // 在上线环境中，devtool为source-map
    devtool = 'source-map';
}

var config = {
    entry: {
        app: "./src/main.js",
        vendor: ['jquery', 'biz-ui', 'es6-promise'],
    },
    output: {
        path: 'dist',
        filename: '[name].[' + hashType + '].js',
        publicPath: '/dist/',
        chunkFilename: '[name].[' + hashType + '].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.json', '.es6.js'],
        alias: {
            // ================================
            // 自定义路径别名
            // ================================

        }
    },
    // resolveLoader: {
    //     root: path.join(__dirname, 'node_modules')
    // },

    module: {
        loaders: [
        {
            test: /\.(less)$/i,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader','less-loader')
        }, {
            test: /\.(css)$/i,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')

        }, {
            test: /\.(jpe?g|png|gif|svg|ico)/i,
            loader: 'file?name=img_[hash:8].[ext]',
        }, {
            test: /\.(js|jsx)$/i,
            exclude: /node_modules/,
            loader: 'babel',
            //https://github.com/babel/babel-loader#options
            //use cache to speed up transform,
            //
            //#generator ****.json.gzip files in pwd when use babel-loader cacheDirectory attribute
            //https://github.com/davezuko/react-redux-starter-kit/issues/579
            //
            //#npm bug About os.tmpdir() sometimes output system tmp directory, sometimes pwd
            //https://github.com/npm/npm/issues/4531
            // cacheDirectory: os.tmpDir()
            query: {

            }
        },{
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            loader : 'file-loader'
        }]


    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^\.\/zh\-cn$/),
        // //生成vendor chunk，抽取第三方模块单独打包成独立的chunk
        // new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[hash].js'),
        // //抽取webpack loader公共部分的代码到manifest.js中，避免每次打包时hash发生变化
        // new webpack.optimize.CommonsChunkPlugin({
        //     names: ['vendor', 'manifest']
        // }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[' + hashType + '].js',
            chunks: ['app', 'vendor']
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            filename: 'manifest.[' + hashType + '].js', //仅包含webpack运行时环境和映射表
            chunks: ['vendor']
        }),

        //全局使用jquery和bizui
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            bizui: 'biz-ui'
        }),

        new HtmlWebpackPlugin({
            template: './templates/app.html',
            filename: './index.html',
            inject: true,
            chunks: ['app', 'vendor', 'manifest']
        }),

        new ExtractTextPlugin('[name].[' + hashType + '].css', {
            allChunks: false
        }),
        // new webpack.ProgressPlugin(function handler(percentage, msg) {/* ... */})
        new AssetsPlugin({
            filename: './webpack-assets.json',
            prettyPrint: true
        })
    ],
    devServer: {
        proxy: {
            '*.action': {
                target: 'http://localhost:' + mockport,
                bypass: function(req, res, proxyOptions) {
                    //处理jsp页面默认的action

                }
            }
        }
    },
    devtool: devtool
}

if (process.env.NODE_ENV === 'production') {
    //只有线上环境和qa环境在build的时候才需要压缩
    //devserver不能压缩，因为如果压缩，内存打包非常慢
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: false,
        sourceMap: false
    }))
}

module.exports = config;


