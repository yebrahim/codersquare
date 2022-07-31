export type EndpointConfig = { url: string; method: 'get' | 'post'; auth?: boolean };

export enum Endpoints {
  signin = 'signin',
  signup = 'signup',

  listPosts = 'listPosts',
  getPost = 'getPost',
  createPost = 'createPost',
  deletePost = 'deletePost',

  getLikes = 'getLikes',
  createLike = 'createLike',

  getComments = 'getComments',
  createComment = 'createComment',
  deleteComment = 'deleteComment',
}

export const ENDPOINT_CONFIGS: { [key in Endpoints]: EndpointConfig } = {
  [Endpoints.signin]: { method: 'post', url: '/signin' },
  [Endpoints.signup]: { method: 'post', url: '/signup' },

  [Endpoints.listPosts]: { method: 'get', url: '/posts' },
  [Endpoints.getPost]: { method: 'get', url: '/posts/:id' },
  [Endpoints.createPost]: { method: 'post', url: '/posts', auth: true },
  [Endpoints.deletePost]: { method: 'post', url: '/posts/:id', auth: true },

  [Endpoints.getLikes]: { method: 'get', url: '/likes/:postId' },
  [Endpoints.createLike]: { method: 'post', url: '/likes', auth: true },

  [Endpoints.getComments]: { method: 'get', url: '/comments/:postId' },
  [Endpoints.createComment]: { method: 'post', url: '/comments', auth: true },
  [Endpoints.deleteComment]: { method: 'post', url: '/comments/:id', auth: true },
};
