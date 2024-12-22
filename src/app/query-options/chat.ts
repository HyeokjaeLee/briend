import { API_ROUTES } from '@/routes/api';
import type { ApiParams } from '@/types/api-params';
import type { TOKEN_TYPE } from '@/types/jwt';
import { createQueryKeys } from '@/utils';
import { queryOptions } from '@tanstack/react-query';

export const ChatQueryKey = createQueryKeys('chat', [
  'verifyToken',
  'createFriend',
]);

export const ChatQueryOptions = {
  verifyToken: <TTokenType extends TOKEN_TYPE>({
    tokenType,
    token,
  }: ApiParams.VERIFY_CHAT_TOKEN<TTokenType>) =>
    queryOptions({
      queryKey: [ChatQueryKey.verifyToken, tokenType, token],
      queryFn: () =>
        API_ROUTES.VERIFY_CHAT_TOKEN({
          tokenType,
          token,
        }),
      retry: false,
    }),
  createFriend: (params: ApiParams.CREATE_FRIEND) =>
    queryOptions({
      queryKey: [ChatQueryKey.createFriend, params.guestId, params.inviteToken],
      queryFn: () => API_ROUTES.CREATE_FRIEND(params),
      staleTime: 120_000,
      retry: false,
    }),
};
