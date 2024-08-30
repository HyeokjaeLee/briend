import { ROUTES } from '@/routes/client';

export const findCurrentRoute = (pathname: string | null) => {
  if (!pathname) return;

  const allRoutes = { ...ROUTES };

  let matchedRoute: {
    name?: keyof typeof allRoutes;
    point: number;
  } = {
    point: 0,
  };

  for (const key in allRoutes) {
    const routeName = key as keyof typeof allRoutes;

    const route = allRoutes[routeName];

    if (typeof route.pathname === 'string') {
      if (route.pathname === pathname) {
        return route;
      }
    } else if (typeof route.pathname === 'function') {
      const splitedRoutePathname = route.pathname({} as any).split('/');
      const splitedCurrentPathname = pathname.split('/');

      //! i18n을 위한 dynmic route 정보 제거
      splitedCurrentPathname.shift();

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

  if (matchedRoute.name) return allRoutes[matchedRoute.name];
};
