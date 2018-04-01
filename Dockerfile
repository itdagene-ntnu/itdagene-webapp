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

RUN yarn schema prod
RUN yarn relay
RUN RELAY_ENDPOINT=https://itdagene.no/graphql yarn build

#FROM getsentry/sentry-cli:1.26.1 as sentry
#
#RUN mkdir /app
#WORKDIR /app/
#
#ARG SENTRY_AUTH_KEY
#ARG SENTRY_ORG
#ARG SENTRY_PROJECT
#ARG SENTRY_URL
#ARG RELEASE
#
#ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_KEY}
#ENV SENTRY_ORG ${SENTRY_ORG}
#ENV SENTRY_PROJECT ${SENTRY_PROJECT}
#ENV SENTRY_URL ${SENTRY_URL}
#
#COPY --from=builder /app/dist dist
#COPY --from=builder /app/dist-client dist-client
#
#RUN sentry-cli releases new ${RELEASE}
#RUN sentry-cli releases files ${RELEASE} upload-sourcemaps './.next/'
#RUN sentry-cli releases finalize ${RELEASE}

FROM node:8
MAINTAINER Odin Ugedal <odin@ugedal.com>
RUN mkdir /app
WORKDIR /app/

ARG RELEASE
ENV RELEASE ${RELEASE}

COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
RUN yarn --prod
COPY --from=builder /app/.next .next

ENTRYPOINT ["yarn", "start", "-H", "0.0.0.0"]
