import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { LOCAL_STORAGE_JWT } from '.';

export const useAuth = (): { loggedIn: boolean } => {
  const jwt = localStorage.getItem(LOCAL_STORAGE_JWT);
  return useMemo(() => ({ loggedIn: !!jwt }), [jwt]);
};

export const useLogOut = () => {
  const navigate = useNavigate();
  return () => {
    localStorage.removeItem(LOCAL_STORAGE_JWT);
    navigate('/');
  };
};
