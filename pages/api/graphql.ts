import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';
import { resolveRelayEndpoint } from '../../utils/relayEndpoint';

const graphqlProxy = async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const relayEndpoint = resolveRelayEndpoint({
    configuredEndpoint: process.env.RELAY_ENDPOINT,
    nodeEnv: process.env.NODE_ENV,
  });

  try {
    const upstreamResponse = await fetch(relayEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body:
        typeof request.body === 'string'
          ? request.body
          : JSON.stringify(request.body),
    });
    const body = await upstreamResponse.text();

    response.setHeader('Cache-Control', 'no-store');
    response.setHeader(
      'Content-Type',
      upstreamResponse.headers.get('content-type') || 'application/json'
    );
    response.status(upstreamResponse.status).send(body);
  } catch {
    response.status(502).json({
      errors: [{ message: 'GraphQL service unavailable.' }],
    });
  }
};

export default graphqlProxy;
