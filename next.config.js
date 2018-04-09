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
          exclude: /(react\.js|__generated__)/,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            compress: {
              arrows: false,
              booleans: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              if_return: false,
              inline: false,
              join_vars: false,
              keep_infinity: true,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              sequences: false,
              side_effects: false,
              switches: false,
              top_retain: false,
              toplevel: false,
              typeofs: false,
              unused: false,
              conditionals: true,
              dead_code: true,
              evaluate: true
            }
          }
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
