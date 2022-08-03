import { Comment, Post, User } from '@codersquare/shared';

// Post APIs
export interface ListPostsRequest {}
export interface ListPostsResponse {
  posts: Post[];
}

export type CreatePostRequest = Pick<Post, 'title' | 'url'>;
export type DeletePostRequest = { postId: string };
export type DeletePostResponse = {};
export interface CreatePostResponse {}
export interface GetPostResponse {
  post: Post;
}

// Comment APIs
export type CreateCommentRequest = Pick<Comment, 'comment'>;
export interface CreateCommentResponse {}

export interface ListCommentsResponse {
  comments: Comment[];
}

export type DeleteCommentResponse = {};

// Like APIs
export interface CreateLikeResponse {}

export interface ListLikesResponse {
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
