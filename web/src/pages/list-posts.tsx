import { Box } from '@chakra-ui/react';
import { ENDPOINT_CONFIGS, ListPostsRequest, ListPostsResponse } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';

import { PostCard } from '../components/post-card';
import { useDocumentTitle } from '../doc-title';
import { callEndpoint } from '../fetch';

export const ListPosts = () => {
  useDocumentTitle('Home');
  const { url, method } = ENDPOINT_CONFIGS.listPosts;
  const { data, error, isLoading } = useQuery(['listposts'], () =>
    callEndpoint<ListPostsRequest, ListPostsResponse>(url, method, {})
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error loading posts</div>;
  }

  return (
    <Box maxW="2xl" m="auto">
      {data?.posts.map((post, i) => (
        <PostCard key={i} {...post} />
      ))}
    </Box>
  );
};
