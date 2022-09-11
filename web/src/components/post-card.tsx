import { Box, Button, Flex, Icon, Text } from '@chakra-ui/react';
import {
  CountCommentsRequest,
  CountCommentsResponse,
  ENDPOINT_CONFIGS,
  GetUserRequest,
  GetUserResponse,
  Post,
  withParams
} from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { formatDistance } from 'date-fns';
import React, { useCallback } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';

import { callEndpoint } from '../fetch';
import { isLoggedIn } from '../fetch/auth';
import { ROUTES } from '../routes';

export const PostCard: React.FC<{ post: Post; refetch: () => unknown; hideDiscuss?: boolean }> = ({
  post,
  refetch,
  hideDiscuss,
}) => {
  const { id, url: postUrl, title, userId, liked } = post;
  const { user, error, isLoading } = useGetUser(userId);
  const { countCommentsRes } = useCountComments(id);

  const urlWithProtocol = postUrl.startsWith('http') ? postUrl : 'http://' + postUrl;
  const userName = isLoading || !user ? '...' : error ? '<unknown>' : user.userName;
  const commentsCount = countCommentsRes?.count ?? 0;

  const toggleLike = useCallback(
    async (postId: string, like: boolean) => {
      const endpoint = like ? ENDPOINT_CONFIGS.createLike : ENDPOINT_CONFIGS.deleteLike;
      await callEndpoint<{}, {}>(withParams(endpoint, postId));
      refetch();
    },
    [refetch]
  );

  return (
    <Flex m={4} gap={2} align="baseline">
      {isLoggedIn() && (
        <Box position="relative" w={4} onClick={() => toggleLike(id, !liked)}>
          <Icon
            position="absolute"
            top="-0.8rem"
            as={liked ? BsHeartFill : BsHeart}
            fill="gray"
            cursor="pointer"
            _hover={{ fill: 'brown' }}
          />
        </Box>
      )}

      <Box>
        <Flex align="center">
          <a href={urlWithProtocol}>
            <Text color="gray.600" fontWeight="bold" pr={2} style={{ unicodeBidi: 'plaintext' }}>
              {title}
            </Text>
          </a>

          <a href={urlWithProtocol}>
            <Text fontSize="sm" color="gray.400">
              ({getUrlDomain(urlWithProtocol)})
            </Text>
          </a>

          {!hideDiscuss && (
            <Link to={`/p/${id}`}>
              <Button
                ml={2}
                variant="outline"
                borderColor="gray.300"
                borderRadius={4}
                p={2}
                size="xs"
                color={commentsCount ? undefined : 'gray'}
              >
                {commentsCount
                  ? `${commentsCount} comment${commentsCount === 1 ? '' : 's'}`
                  : 'discuss'}
              </Button>
            </Link>
          )}
        </Flex>

        <Flex gap={1} fontSize="sm" color="gray.500">
          <Text>By:</Text>
          <Link to={user ? ROUTES.USER_PROFILE(user.id) : '#'}>
            <Text fontWeight="bold">{userName}</Text>
          </Link>

          <Text> - {formatDistance(post.postedAt, Date.now(), { addSuffix: true })}</Text>
        </Flex>
      </Box>
    </Flex>
  );
};

const getUrlDomain = (url: string): string => {
  try {
    const short = new URL(url).host;
    return short.startsWith('www.') ? short.substring(4) : short;
  } catch {
    return url;
  }
};

const useGetUser = (userId: string) => {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery([`getuser${userId}`], () =>
    callEndpoint<GetUserRequest, GetUserResponse>(withParams(ENDPOINT_CONFIGS.getUser, userId))
  );
  return { user, error, isLoading };
};

const useCountComments = (postId: string) => {
  const { data: countCommentsRes } = useQuery([`countComments${postId}`], () =>
    callEndpoint<CountCommentsRequest, CountCommentsResponse>(
      withParams(ENDPOINT_CONFIGS.countComments, postId),
    )
  );
  return { countCommentsRes };
};
