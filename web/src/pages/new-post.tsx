import { Box, Button, Flex, FormControl, FormLabel, Text } from '@chakra-ui/react';
import { CreatePostRequest, CreatePostResponse, ENDPOINT_CONFIGS } from '@codersquare/shared';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RequiredInput } from '../components/required-input';
import { useDocumentTitle } from '../doc-title';
import { ApiError, callEndpoint } from '../fetch';
import { isLoggedIn } from '../fetch/auth';
import { ROUTES } from '../routes';

export const NewPost = () => {
  useDocumentTitle('New post');
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate(ROUTES.HOME);
    }
  }, [navigate]);

  const submitPost = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      try {
        await callEndpoint<CreatePostRequest, CreatePostResponse>(ENDPOINT_CONFIGS.createPost, {
          title,
          url,
        });
        navigate(ROUTES.HOME);
      } catch (e) {
        setError((e as ApiError).message);
      }
    },
    [navigate, title, url]
  );

  return (
    <form onSubmit={submitPost}>
      <Flex color="gray.700" maxW="lg" mx="auto" my={10} direction="column" gap={4}>
        <FormControl isRequired>
          <FormLabel>Add a title</FormLabel>
          <RequiredInput
            placeholder="Title"
            value={title}
            variant="filled"
            onChange={e => setTitle(e.target.value)}
            style={{ unicodeBidi: 'plaintext' }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Add the post URL</FormLabel>
          <RequiredInput
            placeholder="URL"
            variant="filled"
            value={url}
            onChange={e => setUrl(e.target.value)}
            style={{ unicodeBidi: 'plaintext' }}
          />
        </FormControl>

        <Box m="auto">
          <Button type="submit" display="block" onClick={submitPost}>
            Create post
          </Button>
        </Box>

        {!!error && <Text color="red.700">{error}</Text>}
      </Flex>
    </form>
  );
};
