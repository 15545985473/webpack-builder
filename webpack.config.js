const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const glob = require('glob');
const path = require('path');

const webpack = require('webpack');

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFile = glob.sync(path.join(__dirname, './src/*/index.js'));
  entryFile.forEach( route => {
    const pageName = route.match(/src\/(.*)\/index.js/)[1];
    entry[pageName] = route

    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [`${pageName}`],
        title: pageName,
        minify: true
      })
    )
  });
  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  mode: 'production',
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['url-loader'],
      },
      {
        test: /\.js?$/i,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.less$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: () => require('autoprefixer')({
                overrideBrowserslist: [
                  "last 2 versions",
                  "> 1%",
                  "iOS 7",
                  "last 3 iOS versions"
                ]
              })
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new HTMLInlineCSSWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors.length) {
          console.log('build error');
        }
      });
    }
  ].concat(htmlWebpackPlugins),
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  stats: "errors-only"
}


