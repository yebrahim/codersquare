import { Button, Flex, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import Logo from '../assets/logo.svg';

export const Navbar = () => (
  <Flex p={4} align="center" justify="space-between">
    <Link to="/">
      <Image src={Logo} />
    </Link>

    <Flex gap={5}>
      <Button variant="link" size="sm">
        Sign in
      </Button>
      <Button variant="solid" size="sm">
        Sign up
      </Button>
    </Flex>
  </Flex>
);
