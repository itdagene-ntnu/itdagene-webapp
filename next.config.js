const withSourceMaps = require('@zeit/next-source-maps')();
const SentryWebpackPlugin = require('@sentry/webpack-plugin')
const { SENTRY_ORG, SENTRY_PROJECT, RELEASE, COMMIT_SHA } = process.env
const distDir = process.env.NEXT_DIST_DIR || '.next'
const localImagePatterns =
  process.env.NODE_ENV === 'production'
    ? []
    : [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '8000',
          pathname: '/stands/maps/**',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '8000',
          pathname: '/stands/maps/**',
        },
      ]

module.exports = withSourceMaps({
  distDir,
  async redirects() {
    return [
      {
        source: '/company-information',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/info/om-itdagene',
        destination: '/om-itdagene',
        permanent: true,
      },
      {
        source: '/stands/mondayMap',
        destination: '/stands',
        permanent: true,
      },
      {
        source: '/stands/tuesdayMap',
        destination: '/stands',
        permanent: true,
      },
      {
        source: '/stands/oldStands',
        destination: '/stands',
        permanent: true,
      },
    ]
  },
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
    config.resolve.preferRelative = true;
    if (SENTRY_ORG && SENTRY_PROJECT) {
      config.plugins.push(
      new SentryWebpackPlugin({
        include: distDir,
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
  images: {
    remotePatterns: [
      ...localImagePatterns,
      {
        protocol: 'https',
        hostname: 'cdn.itdagene.no',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'itdagene.no',
        port: '',
        pathname: '/**',
      },
    ],
  },
  swcMinify: true,
});
