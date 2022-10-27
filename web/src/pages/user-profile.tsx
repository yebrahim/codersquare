import { Button, Flex, Input, InputGroup, InputLeftAddon, Text } from '@chakra-ui/react';
import { ENDPOINT_CONFIGS, GetUserRequest, GetUserResponse, UpdateCurrentUserRequest, UpdateCurrentUserResponse, withParams } from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { FormEvent, useCallback, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserCtx } from '../App';

import { ApiError, callEndpoint } from '../fetch';

export const UserProfile = () => {
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editingMode, setEditingMode] = useState(false);
  const [userUpdateError, setUserUpdateError] = useState('');
  const {currentUser} = useContext(UserCtx)
  const isOwnProfile = (id === currentUser.id)
  
  const { data, error, isLoading } = useQuery([`getuser${id}`], () => 
   callEndpoint<GetUserRequest, GetUserResponse>(withParams(ENDPOINT_CONFIGS.getUser, id!)), {
    onSuccess: (data) => {
      setUserName(data.userName);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
    }
   }
   );

  const updateCurrentUser = useCallback(
    async (e: FormEvent | MouseEvent) => {
      e.preventDefault();
      try {
        await callEndpoint<UpdateCurrentUserRequest, UpdateCurrentUserResponse>(ENDPOINT_CONFIGS.updateCurrentUser, {
          userName, 
          firstName,
          lastName
        });
        window.location.reload();
      } catch (e) {
        setUserUpdateError((e as ApiError).message);
      }
    },
    [userName, firstName, lastName]
  );

  const onEditOrSaveClick = async (e: FormEvent | MouseEvent) => {
    if (editingMode)
      await updateCurrentUser(e);
    setEditingMode(!editingMode);
  }

  if (isLoading) {
    return <div>loading...</div>;
  }
 
  if (error || !data) {
    return <div>error loading user: {JSON.stringify(error)}</div>;
  }

  return (
    <Flex maxW="sm" mx="auto" my={10} direction="column" gap={4}>  
            
      <InputGroup>
        <InputLeftAddon children='Username' />
        <Input
            paddingLeft={4}
            value={editingMode? userName : '@' + userName}
            isDisabled={!editingMode}
            onChange={e => setUserName(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon children='First name' />
        <Input
            paddingLeft={4}
            value={firstName}
            isDisabled={!editingMode}
            onChange={e => setFirstName(e.target.value)}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftAddon children='Last name' />
        <Input
            paddingLeft={4}
            value={lastName}
            isDisabled={!editingMode}
            onChange={e => setLastName(e.target.value)}
        />
      </InputGroup>
      {
        isOwnProfile &&
        <Button 
          type="submit" 
          variant={editingMode? "solid" : "outline"} 
          size="sm" 
          display="block" 
          onClick={onEditOrSaveClick}>
            {editingMode? "Save" : "Edit"} 
        </Button>
      }

      {!!userUpdateError && <Text color="red.700">{userUpdateError}</Text>}
    </Flex>
  );
};

