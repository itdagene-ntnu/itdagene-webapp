//@flow
import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { type Environment as EnvironmentType, type Record } from 'react-relay';
import fetch from 'isomorphic-unfetch';

let relayEnvironment = null;

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
function fetchQuery(operation, variables, cacheConfig, uploadables) {
  return fetch(process.env.RELAY_ENDPOINT, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables
    })
  }).then(response => response.json());
}

export default function initEnvironment({
  records = {}
}: { records?: Record } = {}): EnvironmentType {
  // $FlowFixMe
  if (process.browser && relayEnvironment) {
    return relayEnvironment;
  }
  // Create a network layer from the fetch function
  const network = Network.create(fetchQuery);
  const store = new Store(new RecordSource(records));
  const localRelayEnvironment = new Environment({
    network,
    store
  });
  // $FlowFixMe
  if (!process.browser) {
    return localRelayEnvironment;
  }

  // reuse Relay environment on client-side
  relayEnvironment = localRelayEnvironment;
  // TODO FIXME this is just an internal API.
  // Our state is so small, so this should be no problem.. :upsidedown-face:
  store.__disableGC();
  return relayEnvironment;
}
