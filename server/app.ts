import express from 'express';
import logger from 'morgan';

import { errHandler } from './helpers';
import { postRouter, signInRouter, signupRouter } from './routes';

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(logger('dev'));

// ROUTES
app.use('/v1/posts', postRouter);
app.use('/v1/signup', signupRouter);
app.use('/v1/signin', signInRouter);

// ERROR HANDLERS
app.use(errHandler);

export default app;
