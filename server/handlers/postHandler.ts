import crypto from 'crypto';

import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  GetPostRequest,
  GetPostResponse,
  ListPostsRequest,
  ListPostsResponse,
} from '../api';
import { db } from '../datastore';
import { ExpressHandler, Post } from '../types';

export const listPostsHandler: ExpressHandler<ListPostsRequest, ListPostsResponse> = async (
  req,
  res
) => {
  // TODO: add pagination and filtering
  return res.send({ posts: await db.listPosts() });
};

export const createPostHandler: ExpressHandler<CreatePostRequest, CreatePostResponse> = async (
  req,
  res
) => {
  // TODO: better error messages
  if (!req.body.title || !req.body.url || res.locals.userId) {
    return res.sendStatus(400);
  }
  // TODO: validate title and url are non-empty
  // TODO: validate url is new, otherwise add +1 to existing post
  const post: Post = {
    id: crypto.randomUUID(),
    postedAt: Date.now(),
    title: req.body.title,
    url: req.body.url,
    userId: res.locals.userId,
  };
  await db.createPost(post);
  return res.sendStatus(200);
};

export const deletePostHandler: ExpressHandler<DeletePostRequest, DeletePostResponse> = async (
  req,
  res
) => {
  if (!req.body.postId) return res.sendStatus(400);
  db.deletePost(req.body.postId);
  return res.sendStatus(200);
};

export const getPostHandler: ExpressHandler<GetPostRequest, GetPostResponse> = async (req, res) => {
  if (!req.body.postId) return res.sendStatus(400);
  const postToReturn: Post | undefined = await db.getPost(req.body.postId);
  return res.send({ post: postToReturn });
};
