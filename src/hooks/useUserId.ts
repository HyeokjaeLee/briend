import { COOKIES } from '@/constants';

import { useCookies } from './useCookies';

export const useUserId = () => {
  const [{ userId }] = useCookies([COOKIES.USER_ID]);

  return userId;
};
