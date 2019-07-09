const path = require('path');

module.exports = {
  mode: "development",
  entry: './src/ts/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/')
  },
  devtool: 'source-map',
  devServer: {
    contentBase: "public",
    watchContentBase: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};