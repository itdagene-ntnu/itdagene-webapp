require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const withCss = require('@zeit/next-css');

module.exports = withCss({
  webpack: (config, { dev }) => {
    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, '.env'),
        systemvars: true
      }),
      new webpack.IgnorePlugin(/^raven$/)
    ];

    if (!dev) {
      config.devtool = 'source-map';
    }

    config.module.rules.push({
      test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: './',
          outputPath: 'static/',
          name: '[name].[ext]'
        }
      }
    });

    return config;
  }
});
