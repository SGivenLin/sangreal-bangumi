const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
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