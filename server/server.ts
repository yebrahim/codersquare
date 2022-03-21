import dotenv from 'dotenv';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';

import { initDb } from './datastore';
import { signInHandler, signUpHandler } from './handlers/authHandler';
import { createPostHandler, listPostsHandler } from './handlers/postHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { errHandler } from './middleware/errorMiddleware';
import { requestLoggerMiddleware } from './middleware/loggerMiddleware';

(async () => {
  await initDb();
  dotenv.config();

  const app = express();

  app.use(express.json());

  app.use(requestLoggerMiddleware);

  // Public endpoints
  app.get('/healthz', (req, res) => res.send({ status: '✌️' }));
  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));

  app.use(authMiddleware);

  // Protected endpoints
  app.get('/v1/posts', asyncHandler(listPostsHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));

  app.use(errHandler);

  app.listen(process.env.PORT || 3000);
})();
