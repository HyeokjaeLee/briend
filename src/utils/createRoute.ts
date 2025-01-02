import { IS_CLIENT, LANGUAGE, PUBLIC_ENV } from '@/constants';

import { CustomError, ERROR } from './customError';
import { isEnumValue } from './isEnumValue';

interface RouteOptions {
  disableI18n?: boolean;
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
        ? { searchParams?: CustomSearchParams; lng?: LANGUAGE }
        : {
            dynamicPath: Record<Exclude<TDynamicPath, undefined>, string>;
            searchParams?: CustomSearchParams;
            lng?: LANGUAGE;
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

      const lng =
        params.lng || (IS_CLIENT ? location.pathname.split('/')[1] : null);

      if (!options?.disableI18n && isEnumValue(LANGUAGE, lng)) {
        url.pathname = `/${lng}${url.pathname}`;
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
    bottomNavType: options?.bottomNavType ?? 'empty',
    topHeaderType: options?.topHeaderType ?? 'empty',
    topHeaderTitle: options?.topHeaderTitle,
  });
};
