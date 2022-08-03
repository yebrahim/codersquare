import { Like } from '@codersquare/shared';

export interface LikeDao {
  createLike(like: Like): Promise<void>;
  getLikes(postId: string): Promise<number>;
  exists(like: Like): Promise<boolean>;
}
