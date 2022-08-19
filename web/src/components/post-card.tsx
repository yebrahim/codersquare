import { Box, Flex, Text } from '@chakra-ui/react';
import { ENDPOINT_CONFIGS, GetUserRequest, GetUserResponse, Post } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import { callEndpoint } from '../fetch';

export const PostCard = ({ id, title, url: postUrl, userId }: Post) => {
  const { method, url } = ENDPOINT_CONFIGS.getUser;
  const { data, error, isLoading } = useQuery([`getuser${userId}`], () =>
    callEndpoint<GetUserRequest, GetUserResponse>(url.replace(':id', userId), method, {
      id: userId,
    })
  );

  const userName = isLoading || !data ? '...' : error ? '<unknown>' : data.userName;

  return (
    <Box m={4}>
      <Flex align="center">
        <Link to={`/p/${id}`}>
          <Text color="gray.600" pr={2}>
            {title}
          </Text>
        </Link>
        <Link to={`/p/${id}`}>
          <Text fontSize="sm" color="gray.400">
            ({postUrl})
          </Text>
        </Link>
      </Flex>

      <Text fontSize="sm" color="gray.500">
        {userName}
      </Text>
    </Box>
  );
};
