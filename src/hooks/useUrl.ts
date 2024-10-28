import { usePathname, useSearchParams } from 'next/navigation';

import { PUBLIC_ENV } from '@/constants/public-env';

export const useUrl = () => {
  const searchParams = useSearchParams();

  const pathname = usePathname();

  return `${PUBLIC_ENV.BASE_URL}${pathname}${searchParams.size ? `?${searchParams}` : ''}`;
};
