FROM node:10 as builder

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn

ARG RELEASE
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG COMMIT_SHA

ENV NODE_ENV production
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}
ENV RELEASE ${RELEASE}
ENV SENTRY_ORG ${SENTRY_ORG}
ENV SENTRY_PROJECT ${SENTRY_PROJECT}
ENV COMMIT_SHA ${COMMIT_SHA}

COPY . /app

RUN mkdir schema
RUN yarn schema:prod
RUN yarn relay
RUN yarn build

FROM node:10-alpine
MAINTAINER Odin Ugedal <odin@ugedal.com>
RUN mkdir /app
WORKDIR /app/

ARG RELEASE
ENV RELEASE ${RELEASE}

COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/public/static static
RUN yarn --prod
COPY --from=builder /app/.next .next

ENTRYPOINT ["yarn", "start"]
