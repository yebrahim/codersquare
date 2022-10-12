import { ENDPOINT_CONFIGS } from '@codersquare/shared';
import supertest from 'supertest';

import { getTestServer } from './testserver';

describe('integration test', () => {
  let client: supertest.SuperTest<supertest.Test>;

  const email = 'user@mail.com';
  const userName = 'u';
  const password = '123';

  beforeAll(async () => {
    client = await getTestServer();
  });

  it('/healthz works', async () => {
    const result = await client.get(ENDPOINT_CONFIGS.healthz.url).expect(200);
    expect(result.body).toStrictEqual({ status: 'ok!' });
  });

  it('signs up a new user', async () => {
    const { method, url } = ENDPOINT_CONFIGS.signup;
    const result = await client[method](url)
      .send({
        email,
        userName,
        password,
      })
      .expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it('fails signup without required fields', async () => {
    const { method, url } = ENDPOINT_CONFIGS.signup;
    await client[method](url)
      .send({
        firstName: 'fname',
        lastName: 'lname',
        userName,
        password,
      })
      .expect(400);
  });

  it('can log in with username', async () => {
    const { method, url } = ENDPOINT_CONFIGS.signin;
    const result = await client[method](url).send({ login: userName, password }).expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it('can log in with email', async () => {
    const { method, url } = ENDPOINT_CONFIGS.signin;
    const result = await client[method](url).send({ login: email, password }).expect(200);
    expect(result.body.jwt).toBeDefined();
  });

  it('creates a post and returns it in list and get', async () => {
    const postTitle = 'first post';
    const postUrl = 'firstpost.com';

    {
      const { method, url } = ENDPOINT_CONFIGS.createPost;
      await client[method](url)
        .send({ title: postTitle, url: postUrl })
        .set(await getAuthToken())
        .expect(200);
    }

    let postId: string;
    {
      const { method, url } = ENDPOINT_CONFIGS.listPosts;
      const postList = await client[method](url).expect(200);
      expect(postList.body.posts).toHaveLength(1);
      expect(postList.body.posts[0].title).toBe(postTitle);
      expect(postList.body.posts[0].url).toBe(postUrl);
      postId = postList.body.posts[0].id;
    }

    {
      const { method, url } = ENDPOINT_CONFIGS.getPost;
      const post = await client[method](url.replace(':id', postId)).expect(200);
      expect(post.body.post.id).toBe(postId);
      expect(post.body.post.title).toBe(postTitle);
      expect(post.body.post.url).toBe(postUrl);
    }
  });

  it('fails to create post with duplicate URL', async () => {
    const postUrl = 'unique-post.com';

    {
      const { method, url } = ENDPOINT_CONFIGS.createPost;
      await client[method](url)
        .send({ title: 'first post', url: postUrl })
        .set(await getAuthToken())
        .expect(200);
    }

    {
      const { method, url } = ENDPOINT_CONFIGS.createPost;
      await client[method](url)
        .send({ title: 'second post', url: postUrl })
        .set(await getAuthToken())
        .expect(400);
    }
  });

  it('likes first post, cannot like twice', async () => {
    const postId = await get1stPost();
    const { method, url } = ENDPOINT_CONFIGS.createLike;
    await client[method](url.replace(':postId', postId))
      .set(await getAuthToken())
      .expect(200);

    // Second time should fail
    await client[method](url.replace(':postId', postId))
      .set(await getAuthToken())
      .expect(400);
  });

  it('lists number of likes', async () => {
    const postId = await get1stPost();
    const { method, url } = ENDPOINT_CONFIGS.listLikes;
    const result = await client[method](url.replace(':postId', postId)).expect(200);
    expect(result.body.likes).toBe(1);
  });

  it('comments on post, multiple times, returns list of comments, deletes 1st comment', async () => {
    const olderComment = 'this is the first comment';
    const newerComment = 'this is the second comment';

    const postId = await get1stPost();
    {
      const { method, url } = ENDPOINT_CONFIGS.createComment;
      await client[method](url.replace(':postId', postId))
        .set(await getAuthToken())
        .send({ comment: olderComment })
        .expect(200);
      await client[method](url.replace(':postId', postId))
        .set(await getAuthToken())
        .send({ comment: newerComment })
        .expect(200);
    }

    let commentId: string;
    {
      const { method, url } = ENDPOINT_CONFIGS.listComments;
      const results = await client[method](url.replace(':postId', postId)).expect(200);
      expect(results.body.comments).toHaveLength(2);
      expect(results.body.comments[0].comment).toBe(newerComment);
      expect(results.body.comments[1].comment).toBe(olderComment);
      commentId = results.body.comments[0].id;
    }

    {
      const { method, url } = ENDPOINT_CONFIGS.deleteComment;
      await client[method](url.replace(':id', commentId))
        .set(await getAuthToken())
        .expect(200);
    }

    {
      const { method, url } = ENDPOINT_CONFIGS.listComments;
      const results = await client[method](url.replace(':postId', postId)).expect(200);
      expect(results.body.comments).toHaveLength(1);
    }
  });

  const getAuthToken = async () => {
    const { method, url } = ENDPOINT_CONFIGS.signin;
    const result = await client[method](url).send({ login: email, password }).expect(200);
    return { Authorization: 'Bearer ' + result.body.jwt };
  };

  const get1stPost = async () => {
    const { method, url } = ENDPOINT_CONFIGS.listPosts;
    const postList = await client[method](url).expect(200);
    return postList.body.posts[0].id;
  };
});
