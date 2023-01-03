import {
  ENDPOINT_CONFIGS,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
} from '@codersquare/shared';
import { useQuery } from '@tanstack/react-query';
import { ReactNode, createContext, useContext } from 'react';

import { callEndpoint } from '../fetch';
import { isLoggedIn } from '../fetch/auth';

type UserContext = {
  currentUser?: GetCurrentUserResponse;
  refreshCurrentUser: () => void;
};

type CurrentUserContextProviderProps = {
  children: ReactNode;
};

export const userContext = createContext({} as UserContext);
export const useCurrentUser = () => useContext(userContext);

export const CurrentUserContextProvider = ({ children }: CurrentUserContextProviderProps): JSX.Element => {
  const { data: currentUser, refetch: refreshCurrentUser } = useQuery(
    ['getCurrentUser'],
    () =>
      callEndpoint<GetCurrentUserRequest, GetCurrentUserResponse>(ENDPOINT_CONFIGS.getCurrentUser),
    {
      enabled: isLoggedIn(),
    }
  );

  return (
    <userContext.Provider value={{ currentUser, refreshCurrentUser }}>
      {children}
    </userContext.Provider>
  );
};
