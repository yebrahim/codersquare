import { Box, Flex, Text } from '@chakra-ui/react';
import { ENDPOINT_CONFIGS, GetUserRequest, GetUserResponse } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { callEndpoint } from '../fetch';

export const UserProfile = () => {
  const { id } = useParams();
  const { url, method } = ENDPOINT_CONFIGS.getUser;
  const { data, error, isLoading } = useQuery([`getuser${id}`], () =>
    callEndpoint<GetUserRequest, GetUserResponse>(url.replace(':id', id!), method, {})
  );

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error || !data) {
    return <div>error loading user: {JSON.stringify(error)}</div>;
  }

  return (
    <Box maxW="sm">
      <Flex>
        <Text w={16} color="GrayText">
          User:
        </Text>
        <Text>{data.userName}</Text>
      </Flex>
      <Flex>
        <Text w={16} color="GrayText">
          Name:
        </Text>
        <Text>
          {data.firstName} {data.lastName}
        </Text>
      </Flex>
    </Box>
  );
};
