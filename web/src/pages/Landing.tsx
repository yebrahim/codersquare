import { useQuery } from 'react-query';
import { listAllPosts } from '../client';

export const LandingPage = () => {
  const { data, isLoading, isError } = useQuery('listAllPosts', listAllPosts);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !data) {
    return <div>Error happened while loading posts.</div>;
  }

  return (
    <div style={{ padding: 10, maxWidth: 800, margin: 'auto' }}>
      <div style={{ display: 'flex', backgroundColor: 'lightblue', padding: 2 }}>
        <h3 style={{ margin: 3, border: '1px solid white', paddingLeft: 3, paddingRight: 3 }}>
          CS
        </h3>
        <h3 style={{ margin: 3 }}>CoderSquare</h3>
      </div>
      <div style={{ maxWidth: 800, margin: 'auto' }}>
        <br />
        {data.posts.map((p: any, i: number) => (
          <div key={i}>
            <h3 style={{ marginTop: 3, marginBottom: 3 }}>{p.title}</h3>
            <div>{p.url}</div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};
