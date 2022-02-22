import express from 'express';
import asyncHandler from 'express-async-handler';

import { createLike } from '../handlers';

const likeRouter = express.Router();

likeRouter.post('/', asyncHandler(createLike));

export { likeRouter };
