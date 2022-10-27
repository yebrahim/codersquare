import { ERRORS, EndpointConfig } from '@codersquare/shared';
import { QueryClient } from '@tanstack/react-query';

import { isDev } from '../util';
import { getLocalStorageJWT, isLoggedIn, signOut } from './auth';

const API_HOST = isDev ? `http://localhost:${window.location.port}` : 'https://api.codersquare.xyz';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'offlineFirst',
      retry(failureCount, error) {
        const { status } = error as ApiError;
        if (typeof status !== 'number') {
          console.error('got non-numeric error code:', error);
          return true;
        }
        return status >= 500 && failureCount < 2;
      },
    },
  },
});

export async function callEndpoint<Request, Response>(
  endpoint: EndpointConfig,
  request?: Request
): Promise<Response> {
  const { url, method, auth } = endpoint;
  const requestBody = request ? JSON.stringify(request) : undefined;
  const response = await fetch(`${HOST}${url}`, {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      // We include an Authorization header when it's explicitly required or
      // when the user is logged in.
      ...((auth || isLoggedIn()) && { Authorization: `Bearer ${getLocalStorageJWT()}` }),
    },
    body: requestBody,
  });
  if (!response.ok) {
    let msg = '';
    try {
      msg = (await response.json()).error;
      // Sign user out and refresh if the token has expired
      if (msg === ERRORS.TOKEN_EXPIRED) {
        signOut();
        window.location.reload();
      }
    } finally {
      throw new ApiError(response.status, msg);
    }
  }
  const isJson = response.headers.get('content-type')?.includes('application/json');
  return isJson ? ((await response.json()) as Response) : ({} as Response);
}
