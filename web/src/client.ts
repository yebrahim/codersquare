import { Post } from '@codersquare/shared';

const API_HOST = 'http://localhost:3001/api/v1';
const LOCAL_STORAGE_JWT = 'jwtToken';

export async function call<Request, Response>(
  endpoint: string,
  method: 'get' | 'post',
  request: Request
): Promise<Response> {
  const response = await fetch(`${API_HOST}${endpoint}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_JWT)}`,
      'Content-Type': 'application/json',
    },
    body: method === 'get' ? undefined : JSON.stringify(request),
  });
  if (!response.ok) {
    const { error } = await response.json();
    throw error;
  }
  return (await response.json()) as Response;
}

export const listAllPosts = async () => {
  const response = await call<{}, { posts: Post[] }>('/posts', 'get', {});
  return response;
};
