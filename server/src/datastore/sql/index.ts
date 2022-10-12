import { Comment, Like, Post, User } from '@codersquare/shared';
import path from 'path';
import { Database, open as sqliteOpen } from 'sqlite';
import sqlite3 from 'sqlite3';

import { Datastore } from '..';
import { SEED_POSTS, SEED_USERS } from './seeds';

export class SqlDataStore implements Datastore {
  private db!: Database<sqlite3.Database, sqlite3.Statement>;

  public async openDb(dbPath: string) {
    const { ENV } = process.env;

    // open the database
    try {
      console.log('Opening database file at:', dbPath);
      this.db = await sqliteOpen({
        filename: dbPath,
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READWRITE,
      });
    } catch (e) {
      console.error('Failed to open database at path:', dbPath, 'err:', e);
      process.exit(1);
    }

    this.db.run('PRAGMA foreign_keys = ON;');

    await this.db.migrate({
      migrationsPath: path.join(__dirname, 'migrations'),
    });

    console.log(process.env.ENV);
    if (ENV === 'development') {
      console.log('Seeding data...');

      SEED_USERS.forEach(async u => {
        if (!(await this.getUserById(u.id))) await this.createUser(u);
      });
      SEED_POSTS.forEach(async p => {
        if (!(await this.getPostByUrl(p.url))) await this.createPost(p);
      });
    }

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
      user.userName
    );
  }

  getUserById(id: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE id = ?`, id);
  }

  getUserByEmail(email: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE email = ?`, email);
  }

  getUserByUsername(userName: string): Promise<User | undefined> {
    return this.db.get<User>(`SELECT * FROM users WHERE userName = ?`, userName);
  }

  listPosts(userId?: string): Promise<Post[]> {
    return this.db.all<Post[]>(
      `SELECT *, EXISTS(
        SELECT 1 FROM likes WHERE likes.postId = posts.id AND likes.userId = ?
      ) as liked FROM posts ORDER BY postedAt DESC`,
      userId
    );
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

  async getPost(id: string, userId: string): Promise<Post | undefined> {
    return await this.db.get<Post>(
      `SELECT *, EXISTS(
        SELECT 1 FROM likes WHERE likes.postId = ? AND likes.userId = ?
      ) as liked FROM posts WHERE id = ?`,
      id,
      userId,
      id
    );
  }

  async getPostByUrl(url: string): Promise<Post | undefined> {
    return await this.db.get<Post>(`SELECT * FROM posts WHERE url = ?`, url);
  }

  async deletePost(id: string): Promise<void> {
    await this.db.run('Delete FROM posts WHERE id = ?', id);
  }

  async createLike(like: Like): Promise<void> {
    await this.db.run('INSERT INTO likes(userId, postId) VALUES(?,?)', like.userId, like.postId);
  }

  async deleteLike(like: Like): Promise<void> {
    await this.db.run(
      'DELETE FROM likes WHERE userId = ? AND postId = ?',
      like.userId,
      like.postId
    );
  }

  async createComment(comment: Comment): Promise<void> {
    await this.db.run(
      'INSERT INTO Comments(id, userId, postId, comment, postedAt) VALUES(?,?,?,?,?)',
      comment.id,
      comment.userId,
      comment.postId,
      comment.comment,
      comment.postedAt
    );
  }

  async countComments(postId: string): Promise<number> {
    const result = await this.db.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM comments WHERE postId = ?',
      postId
    );
    return result?.count ?? 0;
  }

  async listComments(postId: string): Promise<Comment[]> {
    return await this.db.all<Comment[]>(
      'SELECT * FROM comments WHERE postId = ? ORDER BY postedAt DESC',
      postId
    );
  }

  async deleteComment(id: string): Promise<void> {
    await this.db.run('DELETE FROM comments WHERE id = ?', id);
  }

  async getLikes(postId: string): Promise<number> {
    let result = await this.db.get<{ count: number }>(
      'SELECT COUNT(*) as count FROM likes WHERE postId = ?',
      postId
    );
    return result?.count ?? 0;
  }

  async exists(like: Like): Promise<boolean> {
    let awaitResult = await this.db.get<number>(
      'SELECT 1 FROM likes WHERE postId = ? and userId = ?',
      like.postId,
      like.userId
    );
    let val: boolean = awaitResult === undefined ? false : true;
    return val;
  }
}
