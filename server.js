/* eslint no-console: 0 */
const Raven = require('raven');
const express = require('express');
const next = require('next');
const proxy = require('express-http-proxy');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
Raven.config(process.env.RAVEN_DSN, {
  release: process.env.RELEASE,
  logger: 'node'
}).install();
app.prepare().then(() => {
  const server = express();
  server.use(
    '/graphql',
    proxy(process.env.RELAY_ENDPOINT || 'http://localhost:8000/graphql', {
      proxyReqPathResolver: () => '/graphql'
    })
  );
  server.use(Raven.requestHandler());
  server.get('/joblistings/:id', (req, res) => {
    const actualPage = '/joblisting-page';
    const queryParams = { id: req.params.id };
    app.render(req, res, actualPage, queryParams);
  });
  server.get('*', (req, res) => {
    return handle(req, res);
  });
  const port = process.env.PORT || 3000;

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on port ${port}...`);
  });
});
