import { CreateLikeRequest, CreateLikeResponse, GetLikesRequest, GetLikesResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Like } from '../types';

export const createLikeHandler: ExpressHandler<CreateLikeRequest, CreateLikeResponse> = async (
  req,
  res
) => {
  //TODO:Get Userid from Session
  if (!req.body.postId) {
    return res.status(400).send({ error: 'No Post Id' });
  }

  let found = await db.isDuplicateLike({
    postId: req.body.postId,
    userId: res.locals.userId,
  });
  if (found) {
    return res.status(400).send({ error: 'No more likes for same post, same userid' });
  }

  //Valid like Object
  const likeForInsert: Like = {
    postId: req.body.postId,
    userId: res.locals.userId,
  };

  db.createLike(likeForInsert);
  return res.sendStatus(200);
};

export const getLikesHandler: ExpressHandler<GetLikesRequest, GetLikesResponse> = async (
  request,
  response
) => {
  let params: any = request.params;
  const count: Number = await db.getLikes(params.postId);
  return response.send({ likes: count });
};
