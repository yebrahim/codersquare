import { Post, User,Like,Comment } from './types';

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}
export type DeletePostRequest = { postId: string };
export type DeletePostResponse = {};
export type CreatePostRequest = Pick<Post, 'title' | 'url' | 'userId'>;
export interface CreatePostResponse {}
export type GetPostRequest = {postId:string}
export interface GetPostResponse {
  post: Post;
}

// Comment APIs
export type CreateCommentRequest = Pick<Comment, 'userId' | 'postId' | 'comment'>;
export interface CreateCommentResponse {}
export type GetCommentsRequest = { postId: string };
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
  jwt: string
}

export interface SignInRequest {
  login: string; // username or email
  password: string;
}

export type SignInResponse = 
{ user: Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'id'>;
  jwt: string;
}
