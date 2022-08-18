import { ENDPOINT_CONFIGS, GetPostRequest, GetPostResponse } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { callEndpoint } from '../fetch';

export const ViewPost = () => {
  const { id: postId } = useParams();
  const { url, method } = ENDPOINT_CONFIGS.getPost;
  const { data, error, isLoading } = useQuery(['viewpost'], () =>
    callEndpoint<GetPostRequest, GetPostResponse>(url.replace(':id', postId!), method, {
      postId: postId!,
    })
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error loading post: {JSON.stringify(error)}</div>;
  }

  return (
    <div>
      Post {postId}: {JSON.stringify(data)}
    </div>
  );
};
