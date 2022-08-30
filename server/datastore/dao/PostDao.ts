import { Post } from '@codersquare/shared';

export interface PostDao {
  listPosts(userId?: string): Promise<Post[]>;
  createPost(post: Post): Promise<void>;
  getPost(id: string, userId?: string): Promise<Post | undefined>;
  deletePost(id: string): Promise<void>;
}
