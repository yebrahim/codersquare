import { Comment, Like, Post, User } from './types';

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}

export type CreatePostRequest = Pick<Post, 'title' | 'url'>;
export type DeletePostRequest = { postId: string };
export type DeletePostResponse = {};
export interface CreatePostResponse {}
export type GetPostRequest = {postId:string}
export interface GetPostResponse {
  post: Post;
}

// Comment APIs
export type CreateCommentRequest = Pick<Comment, 'userId' | 'postId' | 'comment'>;
export interface CreateCommentResponse {}
export type GetCommentsRequest = { postId: string | undefined };
export interface GetCommentsResponse {
  comments: Comment[];
}
export type DeleteCommentRequest = { commentId: string };
export type DeleteCommentResponse = {};

// Like APIs
export type CreateLikeRequest = Like;
export interface CreateLikeResponse {}
export type GetLikesRequest = { postId: string };
export interface GetLikesResponse {
  likes: Number;
}

// User APIs
export type SignUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'username' | 'password'
>;
export interface SignUpResponse {
  jwt: string;
}

export interface SignInRequest {
  login: string; // username or email
  password: string;
}
export type SignInResponse = {
  user: Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'id'>;
  jwt: string;
};

export type GetUserByEmailRequest = { emailId: string };
export interface GetUserByEmailResponse {
  user: User;
}
export type GetUserByUserNameRequest = {
  username: string;
};
export interface GetUserByUserNameResponse {
  user: User;
}
