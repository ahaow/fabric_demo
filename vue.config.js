const path = require('path')

module.exports = {
    publicPath: './',
    lintOnSave: false,
    chainWebpack: config => {
        config.resolve.alias.set('@', path.resolve(__dirname, './src'))
    }
}