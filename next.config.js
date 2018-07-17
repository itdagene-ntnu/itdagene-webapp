const withCss = require('@zeit/next-css');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpack = withCss({
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = 'source-map';
    }

    config.plugins = config.plugins.map(plugin => {
      if (plugin instanceof UglifyJSPlugin) {
        return new UglifyJSPlugin({
          ...plugin.options,
          sourceMap: true
        });
      }
      return plugin;
    });
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

    config.plugins.push(new LodashModuleReplacementPlugin());

    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      if (
        entries['main.js'] &&
        !entries['main.js'].includes('babel-polyfill')
      ) {
        entries['main.js'].unshift('babel-polyfill');
      }

      return entries;
    };

    return config;
  }
});
module.exports = withBundleAnalyzer({
  webpack,
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    }
  }
});
