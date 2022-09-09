export type EndpointConfig = { url: string; method: 'get' | 'post' | 'delete'; auth?: boolean };

export enum Endpoints {
  healthz = 'healthz',

  signin = 'signin',
  signup = 'signup',
  getUser = 'getUser',
  getCurrentUser = 'getCurrentUser',

  listPosts = 'listPosts',
  getPost = 'getPost',
  createPost = 'createPost',
  deletePost = 'deletePost',

  listLikes = 'listLikes',
  createLike = 'createLike',
  deleteLike = 'deleteLike',

  countComments = 'countComments',
  listComments = 'listComments',
  createComment = 'createComment',
  deleteComment = 'deleteComment',
}

export function WithParams(endpoint: EndpointConfig, ...params: string[]): EndpointConfig {
  let url = endpoint.url
  const placeholders = url.split("/").filter(token => token.startsWith(":"))
  for (let index = 0; index < Math.min(params.length, placeholders.length); index++) {
    url = url.replace(placeholders[index], params[index])
  }
  return {
    url: url, 
    method: endpoint.method,
    auth: endpoint.auth
  } as EndpointConfig
}

export const ENDPOINT_CONFIGS: { [key in Endpoints]: EndpointConfig } = {
  [Endpoints.healthz]: { method: 'get', url: '/api/v1/healthz' },

  [Endpoints.signin]: { method: 'post', url: '/api/v1/signin' },
  [Endpoints.signup]: { method: 'post', url: '/api/v1/signup' },
  [Endpoints.getUser]: { method: 'get', url: '/api/v1/users/:id' },
  [Endpoints.getCurrentUser]: { method: 'get', url: '/api/v1/users', auth: true },

  [Endpoints.listPosts]: { method: 'get', url: '/api/v1/posts' },
  [Endpoints.getPost]: { method: 'get', url: '/api/v1/posts/:id' },
  [Endpoints.createPost]: { method: 'post', url: '/api/v1/posts', auth: true },
  [Endpoints.deletePost]: { method: 'delete', url: '/api/v1/posts/:id', auth: true },

  [Endpoints.listLikes]: { method: 'get', url: '/api/v1/likes/:postId' },
  [Endpoints.createLike]: { method: 'post', url: '/api/v1/likes/:postId', auth: true },
  [Endpoints.deleteLike]: { method: 'delete', url: '/api/v1/likes/:postId', auth: true },

  [Endpoints.countComments]: { method: 'get', url: '/api/v1/comments/:postId/count' },
  [Endpoints.listComments]: { method: 'get', url: '/api/v1/comments/:postId' },
  [Endpoints.createComment]: { method: 'post', url: '/api/v1/comments/:postId', auth: true },
  [Endpoints.deleteComment]: { method: 'delete', url: '/api/v1/comments/:id', auth: true },
};
