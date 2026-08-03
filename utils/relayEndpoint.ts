export const PUBLIC_GRAPHQL_ENDPOINT = 'https://itdagene.no/graphql';
export const LOCAL_GRAPHQL_ENDPOINT = 'http://localhost:8000/graphql';

export const resolveRelayEndpoint = ({
  configuredEndpoint,
  nodeEnv,
}: {
  configuredEndpoint?: string;
  nodeEnv?: string;
}): string => {
  const endpoint = configuredEndpoint?.trim();

  if (endpoint) {
    return endpoint;
  }

  return nodeEnv === 'development'
    ? PUBLIC_GRAPHQL_ENDPOINT
    : LOCAL_GRAPHQL_ENDPOINT;
};
