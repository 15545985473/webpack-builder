const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const glob = require('glob');

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
    htmlWebpackPlugin
  }
},
const { entry, htmlWebpackPlugins } = setMPA();
module.exports = {
  entry: entry,
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
    new FriendlyErrorsWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    function() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors) {
          console.log('build error');
          process.exit(2);
        }
      });
    }
  ].concat(htmlWebpackPlugins),
  stats: "errors-only"
}