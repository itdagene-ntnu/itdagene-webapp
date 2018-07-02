# itDAGENE-webapp
> nextgen itDAGENE frontend

<p align="center">
  <img width="460" src="https://github.com/itdagene-ntnu/itdagene/raw/master/itdagene/assets/img/logoQuiz.png">
</p>

Written using [next.js](https://github.com/zeit/next.js/), [react-relay](https://github.com/facebook/relay/) and [graphql](http://graphql.org/).

## Setup

```bash
$ yarn
$ yarn schema --project=itdagene --all=false -e prod
$ yarn relay
```

## Development

```bash
$ yarn dev
$ # open http://localhost:8000
$ DEBUG=true yarn test
```

## Production

```bash
$ yarn build
$ yarn start
```
