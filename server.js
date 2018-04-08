/* eslint no-console: 0 */
const express = require('express');
const next = require('next');
const Raven = require('raven');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
Raven.config(process.env.RAVEN_DSN, {
  release: process.env.RELEASE,
  logger: 'node'
}).install();
app.prepare().then(() => {
  const server = express();
  server.use(Raven.requestHandler());
  server.get('*', (req, res) => {
    return handle(req, res);
  });
  const port = process.env.PORT || 3000;

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on port ${port}...`);
  });
});
