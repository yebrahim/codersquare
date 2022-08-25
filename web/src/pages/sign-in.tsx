import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RequiredInput } from '../components/required-input';
import { useDocumentTitle } from '../doc-title';
import { isLoggedIn, signIn } from '../fetch/auth';
import { ROUTES } from '../routes';

export const SignIn = () => {
  useDocumentTitle('Sign in');
  const navigate = useNavigate();
  const [un, setUn] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const signin = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      try {
        await signIn(un, pw);
        navigate(ROUTES.HOME);
      } catch {
        setError('Bad credentials');
      }
    },
    [navigate, pw, un]
  );

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  return (
    <form onSubmit={signin}>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={4}>
        <RequiredInput
          placeholder="Username or email"
          value={un}
          variant="filled"
          onChange={e => setUn(e.target.value)}
        />

        <RequiredInput
          placeholder="Password"
          variant="filled"
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
        />

        <Box m="auto">
          <Button type="submit" display="block" onClick={signin}>
            Sign in
          </Button>
        </Box>

        {!!error && <Text color="red.700">{error}</Text>}
      </Flex>
    </form>
  );
};
