const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const dist = path.resolve(__dirname, './dist');

const config = {
  entry: {
    app: './src/main.ts',
    vendor: [
      'chart.js',
      'firebase',
      '@firebase/firestore',
      '@firebase/webchannel-wrapper',
      'vue',
      'vue-chartjs',
      'vue-moment',
      'vue-router',
      'vuelidate',
      'vuetify',
      'vuex',
    ],
  },
  output: {
    path: dist,
    filename: '[name].[chunkhash].js',
  },
  recordsPath: path.join(__dirname, 'records.json'),
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: ['vue-style-loader', 'css-loader', 'sass-loader'],
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
        },
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.ts', '.vue', '.json'],
  },
  performance: {
    hints: false,
  },
  devtool: '#eval-source-map',
  plugins: [
    new CleanWebpackPlugin([dist]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new webpack.BannerPlugin({
      banner: new GitRevisionPlugin().version(),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: require('html-webpack-template'),
      title: 'drivr',
      appMountId: 'app',
      appMountHtmlSnippet: fs.readFileSync('src/splash.html'),
      baseHref: '/',
      mobile: true,
      lang: 'en-US',
      links: ['https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'],
      minify: { collapseWhitespace: true, removeComments: true, minifyCSS: true },
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = '#source-map';
  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: '../webpack-bundles-report.html',
    }),
  ];
} else {
  config.output.filename = '[name].js';
  config.devServer = {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
  };
}

module.exports = config;
