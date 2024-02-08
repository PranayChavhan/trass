import path from 'path';

export default {
  entry: {
    main: './server.js'
  },
  output: {
    path: path.resolve(new URL(import.meta.url).pathname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    clean:true
  },
  mode: 'production',
  target: 'node',
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_module/,
            loader: "babel-loader",
        }
    ]
  }
};
