import { ENDPOINT_CONFIGS, ListPostsRequest, ListPostsResponse } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';

import { callEndpoint } from './fetch-utils';

export const App = () => {
  const { data, error, isLoading } = useQuery(['listposts'], () =>
    callEndpoint<ListPostsRequest, ListPostsResponse>(ENDPOINT_CONFIGS.listPosts, {})
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
