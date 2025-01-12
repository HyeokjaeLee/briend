import { COOKIES } from '@/constants';

import { useCookies } from './useCookies';

export const useUserId = () => {
  const [{ USER_ID }] = useCookies([COOKIES.USER_ID]);

  return USER_ID;
};
