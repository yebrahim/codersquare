import express, { ErrorRequestHandler, RequestHandler } from 'express';

import { createLikeHandler, getLikesHandler } from './handlers/likeHandler';
import { createPostHandler, listPostsHandler } from './handlers/postHandler';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { requestLoggerMiddleware } from './middlewares/requestLoggerHandler';

const app = express();

//Middleware
app.use(express.json());
app.use(requestLoggerMiddleware);

app.get('/v1/posts', listPostsHandler);
app.post('/v1/posts', createPostHandler);

app.post('/v1/likes', createLikeHandler);
app.get('/v1/likes/:postId', getLikesHandler);

app.use(globalErrorHandler);

app.listen(3000);
