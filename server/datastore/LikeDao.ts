import { Like } from '../types';

export interface LikeDao {
  createLike(like: Like): void;
  getLikes(postId:string): number;
  isDuplicateLike(like:Like): boolean;
}
