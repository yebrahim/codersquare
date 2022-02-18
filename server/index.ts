import express, { ErrorRequestHandler, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';

import { initDb } from './datastore';
import { createPostHandler, listPostsHandler } from './handlers/postHandler';
import { signInHandler, signUpHandler } from './handlers/userHandler';
import { globalErrorHandlerMiddleware } from './middleware/globalErrorHandlerMiddleware';
import { requestLoggerMiddleware } from './middleware/requestLoggerMiddleware';

(async () => {
  await initDb();

  const app = express();

  app.use(express.json());


  app.use(requestLoggerMiddleware);

  app.get('/v1/posts', asyncHandler(listPostsHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));

  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));

 
  app.use(globalErrorHandlerMiddleware);

  app.listen(3000);
})();
