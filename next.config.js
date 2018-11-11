const withCss = require('@zeit/next-css');
const withSourceMaps = require('@zeit/next-source-maps')();
module.exports = withSourceMaps(
  withCss({
    webpack: (config, { dev }) => {
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
  })
);
