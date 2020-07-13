const path = require('path')
// const dotenv = require('dotenv')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// if (process.env.NODE_ENV === 'development') {
//   dotenv.config({path: path.join(__dirname, '.env.local')})
//   dotenv.config({path: path.join(__dirname, '.env.development')})
// }

// const envs = Object.entries(process.env)
//   .filter(([name]) => name.startsWith('EJ_'))
//   .map(([name, value]) => ['process.env.' + name, JSON.stringify(value)])
//   .reduce((obj, [name, value]) => (obj[name] = value, obj), {})

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : false,
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist',
    before (app) {
      app.get('/runtime-args.json', (req, res) => {
        res.send(require('./runtime-args.dev.json'))
      })
    },
  },
  context: __dirname,
  entry: {
    app: [
      './src/main.js',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      /* images */
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]',
                },
              },
            },
          },
        ],
      },
      /* svg */
      {
        test: /\.(svg)(\?.*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      /* css */
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      /* postcss */
      {
        test: /\.p(ost)?css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      /* scss */
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
              implementation: require('sass'),
            },
          },
        ],
      },
      /* js */
      {
        test: /\.m?jsx?$/,
        exclude: [
          /node_modules/,
        ],
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.join(__dirname, 'node_modules/.cache/babel-loader'),
            },
          },
          {
            loader: 'babel-loader',
          },
        ],
      },
      /* gql */
      {
        test: /\.(gql|graphql)$/,
        include: [
          path.join(__dirname, 'src'),
        ],
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.join(__dirname, 'node_modules/.cache/cache-loader'),
            },
          },
          {
            loader: 'graphql-tag/loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public/index.html'),
      favicon: path.join(__dirname, 'public/favicon.ico'),
    }),
    process.env.NODE_ENV === 'production' && new WebpackBundleAnalyzer({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ].filter(Boolean),
}
