import { Datastore } from '../';
import { Comment, Like, Post, User } from '../../types';

export class InMemoryDatastore implements Datastore {
  private users: User[] = [];
  private posts: Post[] = [];
  private comments: Comment[] = [];
  private likes: Like[] = [];

  createUser(user: User): Promise<void> {
    this.users.push(user);
    return Promise.resolve();
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find(u => u.email === email));
  }

  getUserByUsername(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find(u => u.username === email));
  }

  listPosts(): Promise<Post[]> {
    return Promise.resolve(this.posts);
  }

  createPost(post: Post): Promise<void> {
    this.posts.push(post);
    return Promise.resolve();
  }

  getPost(id: string): Promise<Post | undefined> {
    return Promise.resolve(this.posts.find(p => p.id === id));
  }

  deletePost(id: string): Promise<void> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.resolve();
    }
    this.posts.splice(index, 1);
    return Promise.resolve();
  }

  createLike(like: Like): Promise<void> {
    this.likes.push(like);
    return Promise.resolve();
  }

  createComment(comment: Comment): Promise<void> {
    this.comments.push(comment);
    return Promise.resolve();
  }

  listComments(postId: string): Promise<Comment[]> {
    return Promise.resolve(this.comments.filter(c => c.postId === postId));
  }

  deleteComment(id: string): Promise<void> {
    const index = this.comments.findIndex(c => c.id === id);
    if (index === -1) {
      return Promise.resolve();
    }
    this.posts.splice(index, 1);
    return Promise.resolve();
  }
  
  //TODO:revisit and fix impl
  getLikes(postId: string): Promise<number> {
    return Promise.resolve(15);
  }
  isDuplicateLike(like: Like): Promise<boolean> {
    return Promise.resolve(false);
  }
}
