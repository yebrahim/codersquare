import { EndpointConfig } from '@codersquare/shared';

const HOST =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://codersquare.xyz';

export async function callEndpoint<Request, Response>(
  config: EndpointConfig,
  request: Request
): Promise<Response> {
  const response = await fetch(`${HOST}${config.url}`, {
    method: config.method,
    body: config.method === 'get' ? undefined : JSON.stringify(request),
  });
  if (!response.ok) {
    const { error } = await response.json();
    throw error;
  }
  return (await response.json()) as Response;
}
