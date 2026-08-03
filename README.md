# itDAGENE-webapp

> nextgen itDAGENE frontend

![Picture of the page](https://cdn.itdagene.no/webapp-screen.png)

Written using [next.js](https://github.com/zeit/next.js/), [react-relay](https://github.com/facebook/relay/) and [graphql](http://graphql.org/).

## Setup

```bash
$ yarn
$ yarn schema:prod # replace 'prod' with 'dev' when running backend
$ yarn relay
```

## Development

The normal development command starts the frontend on
`http://localhost:3000` and reads public data from the production GraphQL API.

```bash
$ yarn dev
$ # open http://localhost:3000
```

Use the local-backend command when the sibling Django application is running on
port 8000:

```bash
$ yarn dev:local
$ # frontend: http://localhost:3000
$ # GraphQL: http://localhost:8000/graphql
```

Browser GraphQL requests use the frontend's same-origin API proxy, so custom
local ports do not require changes to the backend CORS configuration.

To run the browser tests:

```bash
$ yarn build
$ RELAY_ENDPOINT=https://itdagene.no/graphql yarn test
```

Set `TEST_PORT` if port 3000 is already in use.
On macOS the test runner uses the installed Google Chrome when available,
because the Chromium revision bundled with this legacy Puppeteer version is not
compatible with current macOS releases.

## Config

- `RELAY_ENDPOINT`: GraphQL endpoint for Relay.
  Development defaults to `https://itdagene.no/graphql`.
  Production falls back to `http://localhost:8000/graphql` for the existing
  container setup.
- `SENTRY_DSN`: Sentry DSN

## Code style

The source code is formatted with [prettier](https://github.com/prettier/prettier), and use [eslint](https://github.com/eslint/eslint) for basic linting.
To verify that your code is good to go, you have to execute the following commands:

```bash
$ yarn schema:prod
$ yarn relay
$ yarn lint
$ yarn test
$ yarn build
```

## Shared design tokens

`styles/tokens.css` is the source of truth for the public site and the sibling interest-form application.
Run `yarn tokens:check` to verify that both applications use the same tokens.
Run `yarn tokens:sync` after changing the source file.
Set `INTEREST_APP_ROOT` if the interest application is not checked out beside this repository.

The yearly publication owners, fallbacks, and rollover checks are documented in [`docs/content-governance.md`](docs/content-governance.md).

## Running in production

In order to run in production, you have to build and then server the SSR. This project ships
with a `Dockerfile` meant for building and running the project.

```bash
$ yarn build
$ RELAY_ENDPOINT=... yarn start
$ # using docker
$ docker build -t itdagene/itdagene-webapp .
```
