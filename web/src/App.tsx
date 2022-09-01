import { ENDPOINT_CONFIGS, ListPostsRequest, ListPostsResponse } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';

import { callEndpoint } from './fetch';

export const App = () => {
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
    <div>
      Posts:
      {!!data?.posts && <div>{JSON.stringify(data.posts)}</div>}
    </div>
  );
};
