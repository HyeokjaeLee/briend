import { PUBLIC_ENV } from '@/constants';

export const isPrivateRoute = (pathname: string) => {
  const url = new URL(pathname, PUBLIC_ENV.BASE_URL);

  const splitedPathname = url.pathname.split('/');

  return [splitedPathname[1], splitedPathname[2]].includes('private');
};
