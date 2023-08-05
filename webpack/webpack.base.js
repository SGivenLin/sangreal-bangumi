const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const modules = require('../config/modules')

module.exports = {
  entry: {
    'electron': path.resolve(__dirname, '../src/electron/main.ts'),
    'preload': path.resolve(__dirname, '../src/electron/preload.ts')
  },
  target: 'electron-main',
  devtool: 'inline-source-map',
  module: {
    rules: [
      // {
      //   test: /\.(js|jsx|ts|tsx)$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: ['@babel/preset-env']
      //     }
      //   }
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