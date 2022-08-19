export type EndpointConfig = { url: string; method: 'get' | 'post' | 'delete'; auth?: boolean };

export enum Endpoints {
  healthz = 'healthz',

  signin = 'signin',
  signup = 'signup',
  getUser = 'getUser',

  listPosts = 'listPosts',
  getPost = 'getPost',
  createPost = 'createPost',
  deletePost = 'deletePost',

  listLikes = 'listLikes',
  createLike = 'createLike',

  listComments = 'listComments',
  createComment = 'createComment',
  deleteComment = 'deleteComment',
}

export const ENDPOINT_CONFIGS: { [key in Endpoints]: EndpointConfig } = {
  [Endpoints.healthz]: { method: 'get', url: '/api/v1/healthz' },

  [Endpoints.signin]: { method: 'post', url: '/api/v1/signin' },
  [Endpoints.signup]: { method: 'post', url: '/api/v1/signup' },
  [Endpoints.getUser]: { method: 'get', url: '/api/v1/users/:id' },

  [Endpoints.listPosts]: { method: 'get', url: '/api/v1/posts' },
  [Endpoints.getPost]: { method: 'get', url: '/api/v1/posts/:id' },
  [Endpoints.createPost]: { method: 'post', url: '/api/v1/posts', auth: true },
  [Endpoints.deletePost]: { method: 'post', url: '/api/v1/posts/:id', auth: true },

  [Endpoints.listLikes]: { method: 'get', url: '/api/v1/likes/:postId' },
  [Endpoints.createLike]: { method: 'post', url: '/api/v1/likes/:postId', auth: true },

  [Endpoints.listComments]: { method: 'get', url: '/api/v1/comments/:postId' },
  [Endpoints.createComment]: { method: 'post', url: '/api/v1/comments/:postId', auth: true },
  [Endpoints.deleteComment]: { method: 'delete', url: '/api/v1/comments/:id', auth: true },
};
