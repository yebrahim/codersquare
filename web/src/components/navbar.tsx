import { Button, Flex, Image, Text } from '@chakra-ui/react';
import {
  ENDPOINT_CONFIGS,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
} from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../assets/logo.svg';
import { callEndpoint } from '../fetch';
import { isLoggedIn, signOut } from '../fetch/auth';
import { ROUTES } from '../routes';

export const Navbar = () => {
  const navigate = useNavigate();
  const onSignout = useCallback(() => {
    signOut();
    navigate(ROUTES.HOME);
  }, [navigate]);
  const { method, url } = ENDPOINT_CONFIGS.getCurrentUser;
  const { data: currentUser } = useQuery(
    ['getCurrentUser'],
    () => callEndpoint<GetCurrentUserRequest, GetCurrentUserResponse>(url, method, {}),
    { enabled: isLoggedIn() }
  );

  return (
    <Flex py={4} px={10} align="center" justify="space-between" h={16}>
      <Link to={ROUTES.HOME}>
        <Image src={Logo} />
      </Link>

      <Flex gap={5} align="center">
        {isLoggedIn() ? (
          <>
            <Link to={ROUTES.NEW_POST}>
              <Button variant="solid" size="sm">
                New post
              </Button>
            </Link>
            {currentUser && (
              <Link to={ROUTES.USER_PROFILE(currentUser.id)}>
                <Text fontSize="sm" color="gray.600">
                  {currentUser.userName}
                </Text>
              </Link>
            )}
            <Button size="sm" variant="link" onClick={onSignout}>
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link to={ROUTES.SIGN_IN}>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to={ROUTES.SIGN_UP}>
              <Button variant="solid" size="sm">
                Sign up
              </Button>
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  );
};
