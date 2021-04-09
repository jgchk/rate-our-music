const path = require('path')
const process = require('process')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { ESBuildMinifyPlugin } = require('esbuild-loader')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'output'),
    publicPath: '/',
    filename: 'js/[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2018',
        },
      },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
        ],
      },
      {
        test: /\.module\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { modules: true } },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,tsx,js,jsx}',
      },
    }),
    new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
    new HtmlWebpackPlugin(),
  ],
  devtool: isDev ? 'eval-source-map' : false,
  devServer: {
    contentBase: path.join(__dirname, 'output'),
    proxy: {
      '/graphql': 'http://localhost:3030',
      '**': { bypass: () => '/index.html' },
    },
  },
  optimization: {
    minimize: !isDev,
    minimizer: [new ESBuildMinifyPlugin({ target: 'es2018', css: true })],
  },
}
