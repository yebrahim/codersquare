import express from 'express';
import asyncHandler from 'express-async-handler';

import { createPostHandler, listPostsHandler } from '../handlers';

const postRouter = express.Router();

postRouter.get('/', asyncHandler(listPostsHandler));
postRouter.post('/', asyncHandler(createPostHandler));

export { postRouter };
