import crypto from 'crypto';

import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  GetPostResponse,
  ListPostsRequest,
  ListPostsResponse,
} from '../api';
import { Datastore } from '../datastore';
import { ExpressHandler, ExpressHandlerWithParams, Post } from '../types';

export class PostHandler {
  private db: Datastore;

  constructor(db: Datastore) {
    this.db = db;
  }

  public listPostsHandler: ExpressHandler<ListPostsRequest, ListPostsResponse> = async (_, res) => {
    // TODO: add pagination and filtering
    return res.send({ posts: await this.db.listPosts() });
  };

  public createPostHandler: ExpressHandler<CreatePostRequest, CreatePostResponse> = async (
    req,
    res
  ) => {
    // TODO: better error messages
    if (!req.body.title || !req.body.url) {
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
    await this.db.createPost(post);
    return res.sendStatus(200);
  };

  public deletePostHandler: ExpressHandler<DeletePostRequest, DeletePostResponse> = async (
    req,
    res
  ) => {
    if (!req.body.postId) return res.sendStatus(400);
    this.db.deletePost(req.body.postId);
    return res.sendStatus(200);
  };

  public getPostHandler: ExpressHandlerWithParams<{ id: string }, null, GetPostResponse> = async (
    req,
    res
  ) => {
    if (!req.params.id) return res.sendStatus(400);
    const postToReturn: Post | undefined = await this.db.getPost(req.params.id);
    return res.send({ post: postToReturn });
  };
}
