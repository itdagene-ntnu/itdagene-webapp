'use client'

import {
  Environment,
  Network,
  RecordSource,
  Store,
  GraphQLResponse,
  RequestParameters,
  Variables,
  CacheConfig,
  UploadableMap,
} from 'relay-runtime';
import { Environment as EnvironmentType } from 'relay-runtime';
import * as Sentry from '@sentry/node';
import fetch from 'isomorphic-unfetch';

export type EnvSettings = {
  sentryDsn: string;
  release: string;
  relayEndpoint: string;
};

let relayEnvironment: EnvironmentType | null = null;

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(
  operation: RequestParameters,
  variables: Variables,
  cacheConfig: CacheConfig,
  uploadables: UploadableMap | undefined | null,
  envSettings: EnvSettings
): Promise<GraphQLResponse> {
  return fetch(envSettings.relayEndpoint, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then((response) => response.json());
}

function fetchQueryWithSentry(envSettings: EnvSettings) {
  return (
    operation: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig,
    uploadables: UploadableMap | null | undefined
  ): Promise<GraphQLResponse> =>
    fetchQuery(
      operation,
      variables,
      cacheConfig,
      uploadables,
      envSettings
    ).catch((err) => {
      Sentry.captureException(err);
      throw err;
    });
}

export default function initEnvironment({
  records,
  envSettings,
}: {
  records?: ConstructorParameters<typeof RecordSource>[0];
  envSettings: EnvSettings;
}): EnvironmentType {
  if (process.browser && relayEnvironment) {
    return relayEnvironment;
  }
  // Create a network layer from the fetch function
  const network = Network.create(fetchQueryWithSentry(envSettings));
  const store = new Store(new RecordSource(records));
  const localRelayEnvironment = new Environment({
    network,
    store,
  });
  if (!process.browser) {
    return localRelayEnvironment;
  }

  // reuse Relay environment on client-side
  relayEnvironment = localRelayEnvironment;
  // TODO FIXME this is just an internal API.
  // Our state is so small, so this should be no problem.. :upsidedown-face:
  try {
    // @ts-ignore
    store._gcHoldCounter = 1000;
  } catch (err) {
    //
  }
  return relayEnvironment;
}
