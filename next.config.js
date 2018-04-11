const withCss = require('@zeit/next-css');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = withCss({
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

    return config;
  }
});
