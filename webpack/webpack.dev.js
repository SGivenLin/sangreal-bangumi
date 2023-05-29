const baseConfig = require('./webpack.base.js')
const webpackMerge = require('webpack-merge')

const mainConfig = {
  mode: 'development'
}

module.exports = webpackMerge.merge(baseConfig, mainConfig)