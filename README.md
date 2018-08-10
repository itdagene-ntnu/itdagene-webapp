# itDAGENE-webapp

> nextgen itDAGENE frontend

<p align="center">
  <img width="460" src="https://github.com/itdagene-ntnu/itdagene-webapp/blob/master/static/itdagene-gray2.png">
</p>

Written using [next.js](https://github.com/zeit/next.js/), [react-relay](https://github.com/facebook/relay/) and [graphql](http://graphql.org/).

## Setup

```bash
$ yarn
$ yarn schema:prod # replace 'prod' with 'dev' when running backend
$ yarn relay
```

## Development

```bash
$ yarn dev
$ # open http://localhost:8000
$ # To run against itdagene.no:
$ RELAY_ENDPOINT=https://itdagene.no/graphql yarn dev
```

## Config

- `RELAY_ENDPOINT`: graphql endpoint for relay (default: `http://localhost:8000`)
- `RAVEN_PUBLIC_DSN`: Public Sentry Raven DSN
- `RAVEN_DSN`: Sentry Raven DSN

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

## Running in production

In order to run in production, you have to build and then server the SSR. This project ships
with a `Dockerfile` meant for building and running the project.

```bash
$ yarn build
$ RELAY_ENDPOINT=... yarn start
$ # using docker
$ docker build -t itdagene/itdagene-webapp .
```
