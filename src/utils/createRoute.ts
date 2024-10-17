import { LANGUAGE } from '@/constants/language';
import { PUBLIC_ENV } from '@/constants/public-env';

import { CustomError, ERROR } from './customError';
import { isEnumValue } from './isEnumValue';

interface RouteOptions {
  bottomNavType?: 'none' | 'root' | 'empty';
  topHeaderType?: 'none' | 'root' | 'empty' | 'back';
  topHeaderTitle?: string;
}

let routeIndex = 0;

export const createRoute = <
  TDynamicPath extends string | undefined = undefined,
  TSearchParams extends string | undefined = undefined,
>(
  pathname: TDynamicPath extends undefined
    ? string
    : (dynamicPath: Record<Exclude<TDynamicPath, undefined>, string>) => string,
  options?: RouteOptions,
) => {
  const index = routeIndex;

  routeIndex += 1;

  type CustomSearchParams = Partial<
    Record<Exclude<TSearchParams, undefined>, string | undefined>
  >;

  return Object.freeze({
    index,
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
          throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['dynamicPath']));
        }
      }

      const lngPath = location.pathname.split('/')[1];

      if (isEnumValue(LANGUAGE, lngPath)) {
        url.pathname = `/${lngPath}${url.pathname}`;
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
    topHeaderTitle: options?.topHeaderTitle,
  });
};
