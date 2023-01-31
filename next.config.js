const withSourceMaps = require('@zeit/next-source-maps')();
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { SENTRY_ORG, SENTRY_PROJECT, RELEASE, COMMIT_SHA } = process.env

module.exports = withSourceMaps({
  webpack: (config, { dev, isServer }) => {
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

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }
    if (SENTRY_ORG && SENTRY_PROJECT) {
      config.plugins.push(
      new SentryWebpackPlugin({
        include: '.next',
        ignore: ['node_modules'],
        urlPrefix: '/app/.next',
        release: RELEASE,
        setCommits: {
          repo: "itdagene-ntnu/itdagene-webapp",
          commit: COMMIT_SHA
        }
      })
      )
    }

    return config;
  },
});
