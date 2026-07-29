import {
  LOCAL_GRAPHQL_ENDPOINT,
  PUBLIC_GRAPHQL_ENDPOINT,
  resolveRelayEndpoint,
} from './relayEndpoint';

describe('Relay endpoint resolution', () => {
  it('uses the public read-only API for the default development server', () => {
    expect(resolveRelayEndpoint({ nodeEnv: 'development' })).toBe(
      PUBLIC_GRAPHQL_ENDPOINT
    );
  });

  it('preserves an explicitly configured endpoint', () => {
    expect(
      resolveRelayEndpoint({
        configuredEndpoint: ' http://localhost:8000/graphql ',
        nodeEnv: 'development',
      })
    ).toBe(LOCAL_GRAPHQL_ENDPOINT);
  });

  it('keeps the local backend fallback for production containers', () => {
    expect(resolveRelayEndpoint({ nodeEnv: 'production' })).toBe(
      LOCAL_GRAPHQL_ENDPOINT
    );
  });
});
