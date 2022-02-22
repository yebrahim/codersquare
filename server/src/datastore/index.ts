import { CommentDao, LikeDao, PostDao, UserDao } from './dao';
import { SqlDataStore } from './sql';

// import { InMemoryDatastore } from './memorydb';

export interface Datastore extends UserDao, PostDao, LikeDao, CommentDao {}

export let db: Datastore;

export async function initDb() {
  // db = new InMemoryDatastore();
  db = await new SqlDataStore().openDb();
}
