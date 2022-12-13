import { Button, Flex, Image, Text } from '@chakra-ui/react';
import { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Logo from '../assets/logo.svg';
import { isLoggedIn, signOut } from '../fetch/auth';
import { ROUTES } from '../routes';
import { useCurrentUser } from './userContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, refreshCurrentUser } = useCurrentUser();
  const onSignout = useCallback(() => {
    signOut();
    refreshCurrentUser();
    navigate(ROUTES.HOME);
  }, [navigate]);

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
            <Button size="sm" variant="ghost" onClick={onSignout}>
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
