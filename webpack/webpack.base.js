const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const modules = require('../config/modules')

module.exports = {
  entry: {
    'electron': path.resolve(__dirname, '../src/electron/main.ts'),
    'preload': path.resolve(__dirname, '../src/electron/preload.ts')
  },
  target: 'electron-main',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist')
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      // {
      //   oneOf: [
      //     {
      //       test: /\.(js|jsx|ts|tsx)$/,
      //       exclude: /node_modules/,
      //       use: {
      //         loader: 'babel-loader',
      //         options: { cacheDirectory: true }
      //       }
      //     },
      //   ]
      // },
      {
        test: /.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }]
      },
    ]
  },
  plugins: [new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!electron.js'] })],
  externals: {
    'sqlite3': 'commonjs sqlite3'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      ...modules.webpackAliases
    },
  }
}