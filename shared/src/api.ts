import { Comment, Post, User } from './types';

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}

export type CreatePostRequest = Pick<Post, 'title' | 'url'>;
export type DeletePostRequest = { postId: string };
export type DeletePostResponse = {};
export interface CreatePostResponse {}
export type GetPostRequest = { postId: string };
export interface GetPostResponse {
  post: Post;
}

// Comment APIs
export type CreateCommentRequest = Pick<Comment, 'comment'>;
export interface CreateCommentResponse {}
export type CountCommentsRequest = { postId: string };
export type CountCommentsResponse = { count: number };

export interface ListCommentsResponse {
  comments: Comment[];
}

export type DeleteCommentResponse = {};

// Like APIs
export interface ListLikesResponse {
  likes: Number;
}

// User APIs
export type SignUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'userName' | 'password'
>;
export interface SignUpResponse {
  jwt: string;
}

export interface SignInRequest {
  login: string; // userName or email
  password: string;
}
export type SignInResponse = {
  user: Pick<User, 'email' | 'firstName' | 'lastName' | 'userName' | 'id'>;
  jwt: string;
};

export type GetUserRequest = {};
export type GetUserResponse = Pick<User, 'id' | 'firstName' | 'lastName' | 'userName'>;

export type GetCurrentUserRequest = {};
export type GetCurrentUserResponse = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'userName' | 'email'
>;

export type UpdateCurrentUserRequest = Partial<Omit<User, 'id' | 'email'>>;
export type UpdateCurrentUserResponse = {};

export type GetUserByEmailRequest = { emailId: string };
export interface GetUserByEmailResponse {
  user: User;
}
export type GetUserByUserNameRequest = {
  userName: string;
};
export interface GetUserByUserNameResponse {
  user: User;
}
