import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export function useAuth() {
  const value = useContext(UserContext);

  return { ...value, isCompleted: true };
}
