import { CommentDao } from './dao/CommentDao';
import { LikeDao } from './dao/LikeDao';
import { PostDao } from './dao/PostDao';
import { UserDao } from './dao/UserDao';
import { InMemoryDatastore } from './memorydb';

export interface Datastore extends UserDao, PostDao, LikeDao, CommentDao {}

export const db = new InMemoryDatastore();
