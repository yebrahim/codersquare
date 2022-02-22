import { CreateLikeRequest, CreateLikeResponse, SignInRequest, SignInResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Like } from '../types';

export const createLike: ExpressHandler<CreateLikeRequest, CreateLikeResponse> = async (
  req,
  res
) => {
  const { postId, userId } = req.body;
  if (!postId || !userId) {
    return res.sendStatus(400);
  }
  const like: Like = {
    postId,
    userId,
  };
  await db.createLike(like);
  return res.status(200).send({
    message: 'post liked',
    data: { userId, postId },
  });
};
