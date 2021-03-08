const path = require('path')

module.exports = {
  mode: 'development',
  devServer: {
    port: 8333,
    publicPath: '/dist/',
    // https://github.com/webpack/webpack-dev-server/issues/2484
    injectClient: false,
  },
  entry: './src/index.ts',
  output: {
    library: 'mmp',
    libraryTarget: 'umd',
    filename: 'bundle.js',
    globalObject: 'this',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
}