import { CreateLikeRequest, CreateLikeResponse, GetLikesRequest, GetLikesResponse,  } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Like } from '../types';

export const createLikeHandler: ExpressHandler<CreateLikeRequest, CreateLikeResponse> = (
  req,
  res
) => {
  if (!req.body.postId) {
    return res.sendStatus(400).send('No Post Id');
  }

  if (!req.body.userId) {
    return res.sendStatus(400).send('No User Id');
  }

  let found = db.isDuplicateLike({
    postId: req.body.postId,
    userId:req.body.userId
  });
  if(found){
    return res.sendStatus(400).send('No more likes for same post, same userid');
  }

  //Valid like Object
  const likeForInsert: Like = {
    postId: req.body.postId,
    userId: req.body.userId,
  };

  db.createLike(likeForInsert);
  return res.sendStatus(200);
};

export const getLikesHandler: ExpressHandler<GetLikesRequest, GetLikesResponse> = (
  request,
  response
) => {
  let params:any = request.params;
  const count:Number =  db.getLikes(params.postId);
  console.log(count)
  return response.send({likes:count});
};
