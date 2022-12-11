import { User } from '@codersquare/shared';

export interface UserDao {
  createUser(user: User): Promise<void>;
  updateCurrentUser(user: Partial<User>): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(userName: string): Promise<User | undefined>;
}
