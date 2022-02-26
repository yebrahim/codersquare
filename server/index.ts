import express, { ErrorRequestHandler, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';

import { initDb } from './datastore';
import { createCommentHandler, deleteCommentHandler } from './handlers/commentHandler';
import { createLikeHandler, getLikesHandler } from './handlers/likeHandler';
import { createPostHandler, deletePostHandler, getPostHandler, listPostsHandler } from './handlers/postHandler';
import { signInHandler, signUpHandler } from './handlers/userHandler';
import { globalErrorHandlerMiddleware } from './middleware/globalErrorHandlerMiddleware';
import { requestLoggerMiddleware } from './middleware/requestLoggerMiddleware';

(async () => {
  await initDb();

  const app = express();

  app.use(express.json());

  app.use(requestLoggerMiddleware);

  app.get('/v1/posts/list', asyncHandler(listPostsHandler));
  app.post('/v1/posts/new', asyncHandler(createPostHandler));
  app.delete('/v1/posts/:id', asyncHandler(deletePostHandler));
  app.get('/v1/posts/:id', asyncHandler(getPostHandler));

  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));
  
  app.post('/v1/likes/new', asyncHandler(createLikeHandler));
  app.get('/v1/likes/:postId', asyncHandler(getLikesHandler));

  app.post('/v1/comments/new', asyncHandler(createCommentHandler));
  //TODO: implement getCommentsHandler
  //app.get('/v1/comments/list',asyncHandler(getCommentsHandler) )
  app.delete('/v1/comments/:id', asyncHandler(deleteCommentHandler));

  app.use(globalErrorHandlerMiddleware);

  app.listen(3000);
})();
