import { COOKIES } from '@/constants';

import { useCookies } from './useCookies';

//TODO: 삭제 필요
export const useUserId = () => {
  const [{ userId }] = useCookies([COOKIES.USER_ID]);

  return userId;
};
