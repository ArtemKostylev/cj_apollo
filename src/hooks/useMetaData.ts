import {useAuth} from './use-auth';
import {useLocation} from 'react-router-dom';
import {useMemo} from 'react';

export const useMetaData = () => {
  const auth = useAuth();
  const location = useLocation() as any;

  return useMemo(() => ({
    courses: location.state?.courses || auth.user?.courses,
    teacherId: location.state?.teacher || auth.user.teacher
  }), [location.state, auth.user]);
}