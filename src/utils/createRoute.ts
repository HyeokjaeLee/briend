interface RouteOptions {
  bottomNavType?: 'root' | 'none';
}

let routeId = 0;

export const createRoute = <
  T extends {
    dynamicPath?: string;
    searchParams?: string;
  } = {
    dynamicPath: undefined;
    searchParams: undefined;
  },
>(
  pathname: T['dynamicPath'] extends undefined
    ? string
    : (
        dynamicPath: Record<Exclude<T['dynamicPath'], undefined>, string>,
      ) => string,
  options?: RouteOptions,
) => {
  routeId += 1;

  type CustomSearchParams = Partial<
    Record<Exclude<T['searchParams'], undefined>, string | undefined>
  >;

  return Object.freeze({
    id: routeId,
    pathname,
    url: (
      params: T['dynamicPath'] extends undefined
        ? { searchParams?: CustomSearchParams }
        : {
            dynamicPath: Record<Exclude<T['dynamicPath'], undefined>, string>;
            searchParams?: CustomSearchParams;
          },
    ) => {
      const url = new URL('/', location.origin);

      if (typeof pathname === 'string') {
        url.pathname = pathname;
      } else {
        if ('dynamicPath' in params && params.dynamicPath) {
          url.pathname = pathname(params.dynamicPath);
        } else {
          throw new Error('dynamicPath is required.');
        }
      }

      const { searchParams } = params;

      if (searchParams) {
        for (const key in searchParams) {
          const _key = key as keyof typeof searchParams;
          const value = searchParams[_key];

          if (value) url.searchParams.append(_key, value);
        }
      }

      return url;
    },
    bottomNavType: options?.bottomNavType ?? true,
  });
};
