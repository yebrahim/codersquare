import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react';
import {
  CreateCommentRequest,
  CreateCommentResponse,
  ENDPOINT_CONFIGS,
  GetPostRequest,
  GetPostResponse,
  ListCommentsResponse,
} from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { PostCard } from '../components/post-card';
import { useDocumentTitle } from '../doc-title';
import { callEndpoint } from '../fetch';

export const ViewPost = () => {
  const { id: postId } = useParams();
  const { url, method } = ENDPOINT_CONFIGS.getPost;
  const { data, error, isLoading } = useQuery(['viewpost'], () =>
    callEndpoint<GetPostRequest, GetPostResponse>(url.replace(':id', postId!), method, {
      postId: postId!,
    })
  );
  const { url: commentsUrl, method: commentsMethod } = ENDPOINT_CONFIGS.listComments;
  const {
    data: commentsData,
    error: commentsError,
    isLoading: commentsLoading,
    refetch,
  } = useQuery(['listcomments'], () =>
    callEndpoint<{}, ListCommentsResponse>(
      commentsUrl.replace(':postId', postId!),
      commentsMethod,
      {}
    )
  );
  const [comment, setComment] = useState('');
  const submitComment = useCallback(async () => {
    const { method, url } = ENDPOINT_CONFIGS.createComment;
    await callEndpoint<CreateCommentRequest, CreateCommentResponse>(
      url.replace(':postId', postId!),
      method,
      { comment }
    );
    setComment('');
    refetch();
  }, [comment, postId, refetch]);

  const postname = isLoading ? 'Loading..' : error || !data ? 'Error' : data.post.title;
  useDocumentTitle(postname);

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error || !data?.post) {
    return <div>error loading post: {JSON.stringify(error)}</div>;
  }

  return (
    <Box>
      <PostCard post={data.post} hideDiscuss />

      <Box w="xl">
        <hr />
      </Box>

      <form onSubmit={submitComment}>
        <Flex direction="column" gap={4} mt={4}>
          {commentsError ? <Text color="red.700">Error loading comments.</Text> : null}

          {commentsLoading ? <Text>Loading comments...</Text> : null}

          {commentsData?.comments?.map((comment, i) => (
            <Box key={i}>{comment.comment}</Box>
          ))}

          {!commentsData?.comments.length && (
            <Text color="GrayText" fontStyle="italic">
              No comments yet. Add the first comment below.
            </Text>
          )}

          <Box w="xl">
            <hr />
          </Box>

          <Textarea value={comment} onChange={e => setComment(e.target.value)} maxW="xl" />
          <Box>
            <Button onClick={submitComment}>Add comment</Button>
          </Box>
        </Flex>
      </form>
    </Box>
  );
};
