import crypto from 'crypto';

import {
  CreateCommentRequest,
  CreateCommentResponse,
  DeleteCommentRequest,
  DeleteCommentResponse,
  ListCommentsRequest,
  ListCommentsResponse,
} from '../api';
import { db } from '../datastore';
import { Comment, ExpressHandler } from '../types';

const createComment: ExpressHandler<CreateCommentRequest, CreateCommentResponse> = async (
  req,
  res
) => {
  const { comment, userId, postId } = req.body;
  if (!comment || !userId || !postId) {
    return res.sendStatus(400);
  }
  const _comment: Comment = {
    id: crypto.randomUUID(),
    userId,
    postId,
    comment,
    postedAt: Date.now(),
  };
  await db.createComment(_comment);
  return res.status(200).send({
    message: 'comment created',
    date: _comment,
  });
};

const listComments: ExpressHandler<ListCommentsRequest, ListCommentsResponse> = async (
  req,
  res
) => {
  const { postId } = req.body;
  if (!postId) {
    return res.sendStatus(400);
  }

  res.send({ comments: await db.listComments(postId) });
};

const deleteComment: ExpressHandler<DeleteCommentRequest, DeleteCommentResponse> = async (
  req,
  res
) => {
  const { id, userId } = req.body;
  if (!id || !userId) {
    return res.sendStatus(400);
  }

  await db.deleteComment(id);

  res.send({ message: 'comment deleted' });
};

export { createComment, listComments, deleteComment };
