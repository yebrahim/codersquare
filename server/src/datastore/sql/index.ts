import path from 'path';
import { Database, open as sqliteOpen } from 'sqlite';
import sqlite3 from 'sqlite3';

import { Datastore } from '../../datastore';
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
    return this.db.get<User>(`SELECT * FROM users WHERE username = ?`, username);
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

  getPost(id: string): Promise<Post | undefined> {
    throw new Error('Method not implemented.');
  }
  deletePost(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async createLike(like: Like): Promise<void> {
    await this.db.run('INSERT INTO likes (postId, userId) VALUES (?,?)', like.postId, like.userId);
  }
  async createComment(comment: Comment): Promise<void> {
    await this.db.run(
      'INSERT INTO comments (id, userId, postId, comment, postedAt) VALUES (?,?,?,?,?)',
      comment.id,
      comment.userId,
      comment.postId,
      comment.comment,
      comment.postedAt
    );
  }
  listComments(postId: string): Promise<Comment[]> {
    return this.db.all<Comment[]>(`SELECT * FROM comments WHERE postId = ?`, postId);
  }
  async deleteComment(id: string): Promise<void> {
    await this.db.run(`DELETE FROM comments where id = ?`, id);
  }
}
