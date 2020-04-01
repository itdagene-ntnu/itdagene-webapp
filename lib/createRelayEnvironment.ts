import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { Environment as EnvironmentType, Record } from 'react-relay';
import Raven from 'raven-js';
import fetch from 'isomorphic-unfetch';

let relayEnvironment = null;

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(
  operation,
  variables,
  cacheConfig,
  uploadables,
  envSettings: EnvSettings
) {
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
  return (operation, variables, cacheConfig, uploadables) =>
    fetchQuery(
      operation,
      variables,
      cacheConfig,
      uploadables,
      envSettings
    ).catch((err) => {
      Raven.captureException(err);
      throw err;
    });
}

export type EnvSettings = {
  ravenPublicDsn: string;
  release: string;
  relayEndpoint: string;
};

export default function initEnvironment({
  records = {},
  envSettings,
}: {
  records?: Record;
  envSettings: EnvSettings;
} = {}): EnvironmentType {
  // $FlowFixMe
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
  // $FlowFixMe
  if (!process.browser) {
    return localRelayEnvironment;
  }

  // reuse Relay environment on client-side
  Raven.config(envSettings.ravenPublicDsn, {
    release: envSettings.release,
  }).install();
  relayEnvironment = localRelayEnvironment;
  // TODO FIXME this is just an internal API.
  // Our state is so small, so this should be no problem.. :upsidedown-face:
  try {
    store._gcHoldCounter = 1000;
  } catch (err) {
    //
  }
  return relayEnvironment;
}
