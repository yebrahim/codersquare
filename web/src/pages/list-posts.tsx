import { ENDPOINT_CONFIGS, ListPostsRequest, ListPostsResponse } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';

import { PostCard } from '../components/post-card';
import { useDocumentTitle } from '../doc-title';
import { callEndpoint } from '../fetch';

export const ListPosts = () => {
  useDocumentTitle('Home');
  const { data, error, isLoading, refetch } = useQuery(['listposts'], () =>
    callEndpoint<ListPostsRequest, ListPostsResponse>(ENDPOINT_CONFIGS.listPosts)
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error loading posts</div>;
  }

  return (
    <>
      {data?.posts.map((post, i) => (
        <PostCard key={i} post={post} refetch={refetch} />
      ))}
    </>
  );
};
