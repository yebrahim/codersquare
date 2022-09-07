import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import { Comment, ENDPOINT_CONFIGS, GetUserRequest, GetUserResponse } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import React from 'react';
import { BsHeart } from 'react-icons/bs';
import { LinkItUrl } from 'react-linkify-it';
import { Link } from 'react-router-dom';

import { callEndpoint } from '../fetch';
import { isLoggedIn } from '../fetch/auth';
import { ROUTES } from '../routes';

export const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
  const { comment: commentText, postedAt, userId } = comment;
  const { method: getUserMethod, url: getUserUrl } = ENDPOINT_CONFIGS.getUser;
  const {
    data: user,
    error,
    isLoading,
  } = useQuery([`getuser${userId}`], () =>
    callEndpoint<GetUserRequest, GetUserResponse>(
      getUserUrl.replace(':id', userId),
      getUserMethod,
      {}
    )
  );

  const userName = isLoading || !user ? '...' : error ? '<unknown>' : user.userName;

  return (
    <Box fontSize="sm" color="GrayText">
      <Flex gap={1} align="baseline">
        {isLoggedIn() && (
          <Box position="relative" w={4}>
            <Icon
              position="absolute"
              top="-0.8rem"
              as={BsHeart}
              fill="gray"
              cursor="pointer"
              _hover={{ fill: 'brown' }}
            />
          </Box>
        )}

        <Text fontSize="xs"> By: </Text>

        <Link to={ROUTES.USER_PROFILE(user?.id ?? '#')}>
          <Text fontSize="xs" fontWeight="bold">
            {userName}
          </Text>
        </Link>

        <Text fontSize="xs">{formatDistance(postedAt, Date.now(), { addSuffix: true })}</Text>
      </Flex>

      <Box whiteSpace="pre-line" borderLeft="1px solid #ddd" pl={2} ml="7px" fontSize="sm">
        <LinkItUrl>
          <Text color="InfoText" style={{ unicodeBidi: 'plaintext' }}>
            {commentText}
          </Text>
        </LinkItUrl>
      </Box>
    </Box>
  );
};
