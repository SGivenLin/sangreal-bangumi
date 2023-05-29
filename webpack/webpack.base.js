const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    'electron': path.resolve(__dirname, '../electron/main.ts'),
    'preload': path.resolve(__dirname, '../electron/preload.ts')
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
}