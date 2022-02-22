import express from 'express';
import asyncHandler from 'express-async-handler';

import { signInHandler, signUpHandler } from '../handlers';

const signupRouter = express.Router();
const signInRouter = express.Router();

signupRouter.post('/', asyncHandler(signUpHandler));
signInRouter.post('/', asyncHandler(signInHandler));

export { signupRouter, signInRouter };
