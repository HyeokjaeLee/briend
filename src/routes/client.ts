import { createRoute } from '@/utils/createRoute';

export const ROUTES = {
  HOME: createRoute('/'),
  TEST: createRoute<{
    dynamicPath: 'id' | 'test';
    searchParams: 'test';
  }>(({ id, test }) => ``),
};
