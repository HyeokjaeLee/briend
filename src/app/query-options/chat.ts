import { API_ROUTES } from '@/routes/api';
import type { ApiParams } from '@/types/api-params';
import { customQueryOption } from '@/utils/customQueryOption';

export const ChatQueryOptions = {
  createFriend: customQueryOption((params: ApiParams.CREATE_FRIEND) => ({
    queryFn: () => API_ROUTES.CREATE_FRIEND(params),
    staleTime: 120_000,
    retry: false,
  })),
};
