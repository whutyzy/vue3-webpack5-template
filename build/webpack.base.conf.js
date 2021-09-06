const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const { resolve } = require('./utils.js')
module.exports = {
    entry: {
        app: resolve('src/main.js')
    },
    output: {
        path: resolve('dist'),
        filename: 'js/[name].[chunkhash].js',
        publicPath: './',
        clean: true
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: { '@': resolve('src') }
    },
    devServer: {
        // http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename] 进行访问
        historyApiFallback: true,
        hot: true,
        client: {
            overlay: false,
            logging: 'none',
            progress: true
        },
        compress: true,
        host: 'localhost',
        port: '8080'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                },
                include: [resolve('src')]
            },
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: { implementation: require('dart-sass') }
                    }
                ]
            },
            {
                test: /\.(eot|svg|ttf|woff|)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[hash:8][ext]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                type: 'asset',
                generator: {
                    // [ext]前面自带"."
                    filename: 'assets/[name].[hash:8][ext]'
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 // 4kb
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('public/index.html'),
            title: 'vue3-webpack-title'
        }),
        new VueLoaderPlugin()
    ]
}
