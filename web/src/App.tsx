import { ListPostsResponse } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';

import { listPosts } from './client';

export const App = () => {
  const { data, error, isLoading } = useQuery<ListPostsResponse>(['listposts'], listPosts);

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
