import { ROUTES } from '@/routes/client';

import { CustomError, ERROR, ERROR_STATUS } from './customError';

export const findRoute = (pathname: string) => {
  const allRoutes = { ...ROUTES };

  let matchedRoute: {
    name?: keyof typeof allRoutes;
    point: number;
  } = {
    point: 0,
  };

  const splitedCurrentPathname = pathname.split('/');

  //! i18n을 위한 dynmic route 정보 제거
  splitedCurrentPathname.splice(1, 1);

  for (const key in allRoutes) {
    const routeName = key as keyof typeof allRoutes;

    const route = allRoutes[routeName];

    if (typeof route.pathname === 'string') {
      if (
        route.pathname === splitedCurrentPathname.join('/') ||
        (route.pathname === '/' && splitedCurrentPathname.length === 1)
      ) {
        return {
          name: routeName,
          ...route,
        } as const;
      }
    } else if (typeof route.pathname === 'function') {
      const splitedRoutePathname = route.pathname({} as any).split('/');

      if (splitedRoutePathname.length !== splitedCurrentPathname.length)
        continue;

      let matchPoint = 0;

      const isAllSame = splitedCurrentPathname.every((path, index) => {
        const partOfRoutePathname = splitedRoutePathname[index];

        //! 동적 경로인 경우 더 일치도가 높은 라우트를 설정

        if (partOfRoutePathname === 'undefined') {
          matchPoint += 1;

          return true;
        }

        if (path === partOfRoutePathname) {
          matchPoint += 2;

          return true;
        }

        return false;
      });

      if (isAllSame && matchedRoute.point < matchPoint) {
        matchedRoute = {
          name: routeName,
          point: matchPoint,
        };
      }
    }
  }

  if (!matchedRoute.name)
    throw new CustomError({
      status: ERROR_STATUS.NOT_FOUND,
      cause: `route not found: ${pathname}`,
    });

  const resultRoute = allRoutes[matchedRoute.name];

  if (!resultRoute)
    throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['resultRoute']));

  return {
    name: matchedRoute.name,
    ...resultRoute,
  } as const;
};
