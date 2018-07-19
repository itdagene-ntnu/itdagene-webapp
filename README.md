# itDAGENE-webapp

> nextgen itDAGENE frontend

<p align="center">
  <img width="460" src="https://github.com/itdagene-ntnu/itdagene-webapp/raw/master/static/itdagene-svart.png">
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
```

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

## Building

In order to run in production, you have to build first:

```bash
$ yarn build
$ yarn start
```
