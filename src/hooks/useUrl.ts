import { usePathname, useSearchParams } from 'next/navigation';

import { ENV } from '@/constants/env';

interface UseUrlOptions {
  origin?: boolean;
}

export const useUrl = (options?: UseUrlOptions) => {
  const { origin = true } = options ?? {};

  const searchParams = useSearchParams();

  const pathname = usePathname();

  let url = pathname;

  if (origin) url = ENV.BASE_URL + url;

  if (searchParams.size) url += `?${searchParams}`;

  return url;
};
