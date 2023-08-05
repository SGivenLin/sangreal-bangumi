const baseConfig = require('./webpack.base.js')
const webpackMerge = require('webpack-merge')
const path = require('path')

const mainConfig = {
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist/electron/')
  },
}

module.exports = webpackMerge.merge(baseConfig, mainConfig)