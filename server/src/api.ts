import { Comment, Like, Post, User } from './types';

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}

export type CreatePostRequest = Pick<Post, 'title' | 'url' | 'userId'>;
export interface CreatePostResponse {}

export interface GetPostRequest {}
export interface GetPostResponse {
  post: Post;
}

// Like APIs
export type CreateLikeRequest = Like;
export type CreateLikeResponse = {
  message: string;
  data: Like;
};

// Comment APIs
export type CreateCommentRequest = Pick<Comment, 'userId' | 'comment' | 'postId'>;
export interface CreateCommentResponse {
  message: string;
  date: Comment;
}

export interface ListCommentsRequest {
  postId: string;
}
export interface ListCommentsResponse {
  comments: Comment[];
}

export type DeleteCommentRequest = Pick<Comment, 'id' | 'userId'>;
export interface DeleteCommentResponse {
  message: string;
}

// User APIs
export type SignUpRequest = Pick<
  User,
  'email' | 'firstName' | 'lastName' | 'username' | 'password'
>;
export interface SignUpResponse {}

export interface SignInRequest {
  login: string; // username or email
  password: string;
}
export type SignInResponse = Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'id'>;
