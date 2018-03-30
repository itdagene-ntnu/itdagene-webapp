require('dotenv').config();

const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
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
    return config;
  }
};
