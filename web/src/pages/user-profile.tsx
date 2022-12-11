import { Button, Flex, Input, InputGroup, InputLeftAddon, Text } from '@chakra-ui/react';
import {
  ENDPOINT_CONFIGS,
  GetUserRequest,
  GetUserResponse,
  UpdateCurrentUserRequest,
  UpdateCurrentUserResponse,
  withParams,
} from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { FormEvent, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ApiError, callEndpoint } from '../fetch';
import { useCurrentUser } from '../userContext';

export const UserProfile = () => {
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editingMode, setEditingMode] = useState(false);
  const [userUpdateError, setUserUpdateError] = useState('');
  const { currentUser, refreshCurrentUser } = useCurrentUser();
  const isOwnProfile = id === currentUser?.id;

  // load user profile
  const { data, error, isLoading } = useQuery(
    [`getuser${id}`],
    () => callEndpoint<GetUserRequest, GetUserResponse>(withParams(ENDPOINT_CONFIGS.getUser, id!)),
    {
      onSuccess: data => {
        setUserName(data.userName);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
      },
    }
  );

  const updateCurrentUser = useCallback(async () => {
    await callEndpoint<UpdateCurrentUserRequest, UpdateCurrentUserResponse>(
      ENDPOINT_CONFIGS.updateCurrentUser,
      {
        userName,
        firstName,
        lastName,
      }
    );
  }, [userName, firstName, lastName]);

  const onEditOrSaveClick = async (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    if (editingMode) {
      // transitioning from editionMode means that the user is updating their profile.
      try {
        await updateCurrentUser();
        setUserUpdateError('');
        refreshCurrentUser();
      } catch (e) {
        setUserUpdateError((e as ApiError).message);
        return;
      }
    }
    // toggle editingMode
    setEditingMode(!editingMode);
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error || !data) {
    return <div>error loading user: {JSON.stringify(error)}</div>;
  }

  return (
    <Flex maxW="sm" mx="auto" my={10} direction="column" gap={4}>
      <InputGroup>
        <InputLeftAddon children="Username" />
        <Input
          paddingLeft={4}
          value={editingMode ? userName : '@' + userName}
          isDisabled={!editingMode}
          onChange={e => setUserName(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon children="First name" />
        <Input
          paddingLeft={4}
          value={firstName}
          isDisabled={!editingMode}
          onChange={e => setFirstName(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon children="Last name" />
        <Input
          paddingLeft={4}
          value={lastName}
          isDisabled={!editingMode}
          onChange={e => setLastName(e.target.value)}
        />
      </InputGroup>
      {isOwnProfile && (
        <Button
          type="submit"
          variant={editingMode ? 'solid' : 'outline'}
          size="sm"
          display="block"
          onClick={onEditOrSaveClick}
        >
          {editingMode ? 'Save' : 'Edit'}
        </Button>
      )}

      {!!userUpdateError && <Text color="red.700">{userUpdateError}</Text>}
    </Flex>
  );
};
