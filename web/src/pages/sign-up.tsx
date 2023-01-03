import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RequiredInput } from '../components/required-input';
import { useCurrentUser } from '../components/userContext';
import { useDocumentTitle } from '../doc-title';
import { ApiError } from '../fetch';
import { isLoggedIn, signUp } from '../fetch/auth';
import { ROUTES } from '../routes';

export const SignUp = () => {
  useDocumentTitle('Sign up');
  const navigate = useNavigate();
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [un, setUn] = useState('');
  const [pw, setPw] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { refreshCurrentUser } = useCurrentUser();

  const signup = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      try {
        await signUp(fname, lname, email, pw, un);
        refreshCurrentUser();
        navigate(ROUTES.HOME);
      } catch (e) {
        setError((e as ApiError).message);
      }
    },
    [fname, lname, email, pw, un, refreshCurrentUser, navigate]
  );

  useEffect(() => {
    if (isLoggedIn()) {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  return (
    <form onSubmit={signup}>
      <Flex maxW="sm" mx="auto" my={10} direction="column" gap={4}>
        <RequiredInput
          placeholder="Username"
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

        <RequiredInput
          placeholder="Email"
          value={email}
          variant="filled"
          onChange={e => setEmail(e.target.value)}
        />

        <Input
          placeholder="First name"
          value={fname}
          variant="filled"
          onChange={e => setFname(e.target.value)}
        />

        <Input
          placeholder="Last name"
          value={lname}
          variant="filled"
          onChange={e => setLname(e.target.value)}
        />

        <Box m="auto">
          <Button type="submit" display="block" onClick={signup}>
            Sign up
          </Button>
        </Box>

        {!!error && <Text color="red.700">{error}</Text>}
      </Flex>
    </form>
  );
};
