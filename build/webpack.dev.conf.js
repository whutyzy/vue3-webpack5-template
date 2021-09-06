const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./config')

const baseWebpackConfig = require('./webpack.base.conf')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    module: {},
    stats: 'errors-only',
    devtool: config.dev.devtool,
    devServer: {
        // http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename] 进行访问
        historyApiFallback: true,
        hot: true,
        client: {
            overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
            logging: 'none',
            progress: true
        },
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        proxy: config.dev.proxyTable
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
})

module.exports = devWebpackConfig
