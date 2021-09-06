const merge = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const { resolve } = require('./utils')

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        path: resolve('dist'),
        filename: 'js/[name].[chunkhash].js',
        publicPath: './',
        clean: true
    },
    stats: 'normal',
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        },
        version: process.env.NODE_ENV
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                }
            }),
            new CssMinimizerPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './css/[name].[contenthash].css',
            chunkFilename: './css/[id].[contenthash].css'
        })
    ]
})

module.exports = webpackConfig
