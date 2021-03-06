import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  __DEV__: true,
};

export default {
  debug: true,
  devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  noInfo: true, // set to false to see a list of every file being bundled.
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index',
  ],
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    // Note: Physical files are only output by the production build task `npm run build`.
    path: __dirname.concat('/dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.htmlnew webpack.HotModuleReplacementPlugin());
    new webpack.DefinePlugin(GLOBALS),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      { test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel'] },
      { test: /\.(jpe?g|png|gif|svg)$/i, loaders: ['file'] },
      { test: /(\.css|\.scss)$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap'] },
      { test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader' },
    ],
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, 'node_modules/foundation-sites/scss/')],
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
};
