import { Comment } from '@codersquare/shared';

export interface CommentDao {
  createComment(comment: Comment): Promise<void>;
  countComments(postId: string): Promise<number>;
  listComments(postId: string): Promise<Comment[]>;
  deleteComment(id: string): Promise<void>;
}
