import { Box, Flex, Text } from '@chakra-ui/react';
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
    <Box padding={5} maxWidth="5xl" margin="auto">
      <Flex backgroundColor="lightblue" padding={1} fontWeight="bold">
        <Text margin={1} border="1px" paddingX={1}>
          CS
        </Text>
        <Text marginY={1} border="1px" borderColor="transparent">
          CoderSquare
        </Text>
      </Flex>
      <Box>
        <br />
        {data.posts.map((p: any, i: number) => (
          <Flex key={i} align="center" gap={2}>
            <Text marginY={1} fontWeight="bold">
              {p.title}
            </Text>
            <Text fontSize="sm">{p.url}</Text>
            <hr />
          </Flex>
        ))}
      </Box>
    </Box>
  );
};
