import { User } from '@codersquare/shared';

export interface UserDao {
  createUser(user: User): Promise<void>;
  updateCurrentUser(user: Pick<User, 'id' | 'userName' | 'firstName' | 'lastName'>): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(userName: string): Promise<User | undefined>;
}
