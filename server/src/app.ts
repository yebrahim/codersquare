import express from 'express';
import logger from 'morgan';

import { errHandler } from './helpers';
import { commentRouter, postRouter, signInRouter, signupRouter } from './routes';
import { likeRouter } from './routes/likeRouts';

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(logger('dev'));

// ROUTES
app.use('/v1/posts', postRouter);
app.use('/v1/likes', likeRouter);
app.use('/v1/comments', commentRouter);
app.use('/v1/signup', signupRouter);
app.use('/v1/signin', signInRouter);

// ERROR HANDLERS
app.use(errHandler);

export { app };
