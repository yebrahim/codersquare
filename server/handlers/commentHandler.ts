import crypto from 'crypto';

import {
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  ListCommentsResponse,
} from '../api';
import { Datastore } from '../datastore';
import { Comment, ExpressHandler, ExpressHandlerWithParams } from '../types';

export class CommentHandler {
  private db: Datastore;

  constructor(db: Datastore) {
    this.db = db;
  }

  public createCommentHandler: ExpressHandlerWithParams<
    { postId: string },
    CreateCommentRequest,
    CreateCommentResponse
  > = async (req, res) => {
    if (!req.params.postId) return res.status(400).send({ error: 'Post ID is missing' });
    if (!req.body.comment) return res.status(400).send({ error: 'Comment is missing' });

    if (!(await this.db.getPost(req.params.postId))) {
      return res.status(404).send({ error: 'No post found with this ID' });
    }

    const commentForInsertion: Comment = {
      id: crypto.randomUUID(),
      postedAt: Date.now(),
      postId: req.params.postId,
      userId: res.locals.userId,
      comment: req.body.comment,
    };
    await this.db.createComment(commentForInsertion);
    return res.sendStatus(200);
  };

  public deleteCommentHandler: ExpressHandler<DeleteCommentRequest, DeleteCommentResponse> = async (
    req,
    res
  ) => {
    if (!req.body.commentId) return res.status(404).send({ error: 'No Comment Id' });
    await this.db.deleteComment(req.body.commentId);
    return res.sendStatus(200);
  };

  public listCommentsHandler: ExpressHandlerWithParams<
    { postId: string },
    null,
    ListCommentsResponse
  > = async (req, res) => {
    if (!req.params.postId) {
      return res.status(400).send({ error: 'Post ID missing' });
    }
    const comments = await this.db.listComments(req.params.postId);
    return res.send({ comments });
  };
}
