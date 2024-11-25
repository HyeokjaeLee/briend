import { API_ROUTES } from '@/routes/api';
import type { ApiParams } from '@/types/api';
import type { TOKEN_TYPE } from '@/types/jwt';
import { createQueryKeys } from '@/utils/createQueryKeys';
import { queryOptions } from '@tanstack/react-query';

export const ChatQueryKey = createQueryKeys('chat', [
  'verifyToken',
  'createChannelToken',
] as const);

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
    }),
  createFriend: (params: ApiParams.CREATE_FRIEND) =>
    queryOptions({
      queryKey: [
        ChatQueryKey.createChannelToken,
        params.guestId,
        params.inviteToken,
      ],
      queryFn: () => API_ROUTES.CREATE_FRIEND(params),
      staleTime: 120_000,
    }),
};
