import { Like, Post } from './types';

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

// Comment APIs

// Like APIs
export type CreateLikeRequest = Like
export interface CreateLikeResponse {}
export type GetLikesRequest = String;
export interface GetLikesResponse{
  likes: Number
}

// User APIs
