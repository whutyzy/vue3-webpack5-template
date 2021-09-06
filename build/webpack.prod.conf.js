const merge = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const { resolve } = require('./utils')
const config = require('./config')

const webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
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
    performance: {
        hints: 'warning'
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
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: resolve('public'),
                    to: './',
                    globOptions: {
                        dot: true,
                        gitignore: true
                        // ignore: ['**/index.html*'],
                    }
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: './css/[name].[contenthash].css',
            chunkFilename: './css/[id].[contenthash].css'
        })
    ]
})

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + config.build.productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
