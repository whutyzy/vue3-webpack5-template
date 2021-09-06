const merge = require('webpack-merge')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
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

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
                        ],
                        notes: []
                    },
                    clearConsole: true
                })
            )

            resolve(devWebpackConfig)
        }
    })
})
