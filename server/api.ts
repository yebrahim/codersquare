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
export interface GetPostRequest {}
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
export interface SignUpResponse {}

export interface SignInRequest {
  login: string; // username or email
  password: string;
}
export type SignInResponse = Pick<User, 'email' | 'firstName' | 'lastName' | 'username' | 'id'>;
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