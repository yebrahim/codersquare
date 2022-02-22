import express from 'express';
import asyncHandler from 'express-async-handler';

import { createComment, deleteComment, listComments } from '../handlers';

const commentRouter = express.Router();

commentRouter.post('/', asyncHandler(createComment));
commentRouter.get('/', asyncHandler(listComments));
commentRouter.delete('/', asyncHandler(deleteComment));

export { commentRouter };
