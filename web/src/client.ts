const API_HOST = 'http://localhost:3001/api/v1';

export const listAllPosts = async () => {
  const response = await fetch(`${API_HOST}/posts`);
  if (!response.ok) {
    const { err } = await response.json();
    console.error('Bad response:', err);
    throw err;
  }
  return await response.json();
};
