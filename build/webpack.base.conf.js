const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const WebpackBar = require('WebpackBar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { loadEnvDefine, resolve } = require('./utils')

const isProdMode = process.env.NODE_ENV === 'prod'

module.exports = {
    entry: {
        app: resolve('src/main.js')
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: { '@': resolve('src') }
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
                    !isProdMode
                        ? 'style-loader'
                        : {
                              loader: MiniCssExtractPlugin.loader,
                              options: {
                                  publicPath: '../'
                              }
                          },
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
        new WebpackBar(),
        new webpack.DefinePlugin({
            'process.env': { ...loadEnvDefine(process.env.NODE_ENV) }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve('public/index.html'),
            inject: true
        }),
        new VueLoaderPlugin()
    ]
}
