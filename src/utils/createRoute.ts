import { PUBLIC_ENV } from '@/constants/public-env';

interface RouteOptions {
  bottomNavType?: 'none' | 'root' | 'empty';
  topHeaderType?: 'none' | 'root' | 'empty';
}

let routeId = 0;

export const createRoute = <
  TDynamicPath extends string | undefined = undefined,
  TSearchParams extends string | undefined = undefined,
>(
  pathname: TDynamicPath extends undefined
    ? string
    : (dynamicPath: Record<Exclude<TDynamicPath, undefined>, string>) => string,
  options?: RouteOptions,
) => {
  routeId += 1;

  type CustomSearchParams = Partial<
    Record<Exclude<TSearchParams, undefined>, string | undefined>
  >;

  return Object.freeze({
    id: routeId,
    pathname,
    url: (
      params: TDynamicPath extends undefined
        ? { searchParams?: CustomSearchParams }
        : {
            dynamicPath: Record<Exclude<TDynamicPath, undefined>, string>;
            searchParams?: CustomSearchParams;
          },
    ) => {
      const url = new URL(PUBLIC_ENV.BASE_URL);

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
    bottomNavType: options?.bottomNavType ?? 'none',
    topHeaderType: options?.topHeaderType ?? 'none',
  });
};
