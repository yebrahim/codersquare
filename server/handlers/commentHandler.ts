import { CreateCommentRequest, CreateCommentResponse, DeleteCommentRequest, DeleteCommentResponse } from '../api';
import { db } from '../datastore';
import { ExpressHandler, Comment } from '../types';
import crypto from 'crypto';

//Create Comment Handler
export const createCommentHandler
    :ExpressHandler<CreateCommentRequest,CreateCommentResponse> = async (req,res)=>{

    if(!req.body.postId)
        return res.status(400).send("No Post Id");
    
    if(!req.body.userId)
        return res.status(400).send("No User Id");
    
    if(!req.body.comment)
        return res.status(400).send("No Comment");

    const commentForInsertion:Comment = {
        id:crypto.randomUUID(),
        postedAt: Date.now(),
        postId:req.body.postId,
        userId:req.body.userId,
        comment:req.body.comment
    }
    await db.createComment(commentForInsertion);
    return res.sendStatus(200);
}

//Delete Comment Handler
export const deleteCommentHandler: ExpressHandler<DeleteCommentRequest, DeleteCommentResponse> = async (
    req,
    res
  ) => {
    if (!req.body.commentId)
       return res.status(404).send("No Comment Id");
    await db.deleteComment(req.body.commentId);
    return res.sendStatus(200);
  };
  


