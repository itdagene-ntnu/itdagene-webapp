FROM node:8 as builder

RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn --ignore-scripts

ARG RELEASE

ENV NODE_ENV production
ENV RELEASE ${RELEASE}

COPY . /app

RUN mkdir schema
RUN yarn schema:prod
RUN yarn relay
RUN yarn build

FROM getsentry/sentry-cli:1.26.1 as sentry

RUN mkdir /app
WORKDIR /app/

ARG SENTRY_AUTH_KEY
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_URL
ARG RELEASE

ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_KEY}
ENV SENTRY_ORG ${SENTRY_ORG}
ENV SENTRY_PROJECT ${SENTRY_PROJECT}
ENV SENTRY_URL ${SENTRY_URL}

COPY --from=builder /app/.next .next

RUN sentry-cli releases new ${RELEASE}
RUN sentry-cli releases files ${RELEASE} upload-sourcemaps \
--rewrite --url-prefix="~/_next/$(cat .next/BUILD_ID)/page/" \
'./.next/bundles/pages/'

RUN sentry-cli releases files ${RELEASE} upload-sourcemaps \
--rewrite --url-prefix="~/_next/static/commons/" \
'./.next/static/commons/'
RUN sentry-cli releases finalize ${RELEASE}

FROM node:8
MAINTAINER Odin Ugedal <odin@ugedal.com>
RUN mkdir /app
WORKDIR /app/

ARG RELEASE
ENV RELEASE ${RELEASE}

COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/static static
COPY --from=builder /app/server.js server.js
RUN yarn --prod
COPY --from=builder /app/.next .next

ENTRYPOINT ["yarn", "start"]
