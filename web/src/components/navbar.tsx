import { Button, Flex, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import Logo from '../assets/logo.svg';
import { useAuth, useLogOut } from '../fetch/auth';
import { ROUTES } from '../routes';

export const Navbar = () => {
  const { loggedIn } = useAuth();

  return (
    <Flex py={4} px={10} align="center" justify="space-between">
      <Link to={ROUTES.HOME}>
        <Image src={Logo} />
      </Link>

      <Flex gap={5}>
        {loggedIn ? (
          <Button size="sm" variant="link" onClick={useLogOut}>
            Sign out
          </Button>
        ) : (
          <>
            <Button variant="link" size="sm">
              Sign in
            </Button>
            <Button variant="solid" size="sm">
              Sign up
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};
