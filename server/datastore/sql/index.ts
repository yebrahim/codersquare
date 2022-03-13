import path from 'path';
import { Database, open as sqliteOpen } from 'sqlite';
import sqlite3 from 'sqlite3';

import { Datastore } from '..';
import { Comment, Like, Post, User } from '../../types';

export class SqlDataStore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb() {
    // open the database
    this.db = await sqliteOpen({
      filename: path.join(__dirname, 'codersquare.sqlite'),
      driver: sqlite3.Database,
    });

    this.db.run('PRAGMA foreign_keys = ON;');

    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations'),
    });

    return this;
  }

  async createUser(user: User): Promise<void> {
    await this.db.run(
      'INSERT INTO users (id, email, password, firstName, lastName, userName) VALUES (?,?,?,?,?,?)',
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.username
    );
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE email = ?`, email);
  }

  getUserByUsername(username: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE userName = ?`, username);
  }

  listPosts(): Promise<Post[]> {
    return this.db.all<Post[]>('SELECT * FROM posts');
  }

  async createPost(post: Post): Promise<void> {
    await this.db.run(
      'INSERT INTO posts (id, title, url, postedAt, userId) VALUES (?,?,?,?,?)',
      post.id,
      post.title,
      post.url,
      post.postedAt,
      post.userId
    );
  }

  async getPost(id: string): Promise<Post | undefined> {
    return await this.db.get<Post>('SELECT * FROM posts WHERE postId = ?', id);
  }

  async deletePost(id: string): Promise<void> {
    await this.db.run('Delete FROM posts WHERE id=?', id);
  }

  async createLike(like: Like): Promise<void> {
    await this.db.run('INSERT INTO Likes(userId,postId) VALUES(?,?)', like.userId, like.postId);
  }

  async createComment(comment: Comment): Promise<void> {
    await this.db.run(
      'INSERT INTO Comments(userId,postId,comment,postedAt) VALUES(?,?,?,?)',
      comment.userId,
      comment.postId,
      comment.comment,
      comment.postedAt
    );
  }

  async listComments(postId: string): Promise<Comment[]> {
    return await this.db.all<Comment[]>('SELECT * FROM comments WHERE postId=?', postId);
  }

  async deleteComment(id: string): Promise<void> {
    await this.db.run('Delete FROM comments WHERE Id=?', id);
  }

  async getLikes(postId: string): Promise<number> {
    let awaitResult = await this.db.get<number>('Select count(*) FROM Likes WHERE postId=?', postId);
    let val:number = awaitResult === undefined?0:awaitResult;
    return val;
  }

  async isDuplicateLike(like: Like): Promise<boolean> {
    let awaitResult = await this.db.get<number>('SELECT 1 FROM likes WHERE postId=?,userId=?',like.postId,like.userId);
    let val:boolean = awaitResult === undefined ? false : true;
    return val;
  }
  
}