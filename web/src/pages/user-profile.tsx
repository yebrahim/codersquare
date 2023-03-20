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

import { useCurrentUser } from '../contexts/userContext';
import { ApiError, callEndpoint } from '../fetch';

enum UserProfileMode {
  EDITING,
  VIEWING,
}

export const UserProfile = () => {
  const { id } = useParams();
  const [userName, setUserName] = useState<string>();
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [userProfileMode, setUserProfileMode] = useState(UserProfileMode.VIEWING);
  const [userUpdateError, setUserUpdateError] = useState<string>();
  const { currentUser, refreshCurrentUser } = useCurrentUser();
  const isOwnProfile = id === currentUser?.id;
  const isEditingMode = userProfileMode === UserProfileMode.EDITING;

  // load user profile
  const { error, isLoading } = useQuery(
    [`getuser${id}`],
    () => callEndpoint<GetUserRequest, GetUserResponse>(withParams(ENDPOINT_CONFIGS.getUser, id!)),
    {
      onSuccess: data => {
        setUserName(data.userName);
        setFirstName(data.firstName);
        setLastName(data.lastName);
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

  const handleSaveClick = async () => {
    try {
      await updateCurrentUser();
      setUserUpdateError('');
      refreshCurrentUser();
      setUserProfileMode(UserProfileMode.VIEWING);
    } catch (e) {
      setUserUpdateError((e as ApiError).message);
    }
  };

  const handleEditClick = () => {
    setUserProfileMode(UserProfileMode.EDITING);
  };

  const onEditOrSaveClick = async (e: FormEvent | MouseEvent) => {
    e.preventDefault();
    if (userProfileMode === UserProfileMode.EDITING) {
      await handleSaveClick();
    } else if (userProfileMode === UserProfileMode.VIEWING) {
      handleEditClick();
    }
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>error loading user: {JSON.stringify(error)}</div>;
  }

  return (
    <Flex maxW="sm" mx="auto" my={10} direction="column" gap={4}>
      <InputGroup>
        <InputLeftAddon children="Username" />
        <Input
          paddingLeft={4}
          value={isEditingMode ? userName : '@' + userName}
          isDisabled={!isEditingMode}
          onChange={e => setUserName(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon children="First name" />
        <Input
          paddingLeft={4}
          value={firstName}
          isDisabled={!isEditingMode}
          onChange={e => setFirstName(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon children="Last name" />
        <Input
          paddingLeft={4}
          value={lastName}
          isDisabled={!isEditingMode}
          onChange={e => setLastName(e.target.value)}
        />
      </InputGroup>
      {isOwnProfile && (
        <Button
          type="submit"
          variant={isEditingMode ? 'solid' : 'outline'}
          size="sm"
          display="block"
          onClick={onEditOrSaveClick}
        >
          {isEditingMode ? 'Save' : 'Edit'}
        </Button>
      )}

      {!!userUpdateError && <Text color="red.700">{userUpdateError}</Text>}
    </Flex>
  );
};
