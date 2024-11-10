import { API_ROUTES } from '@/routes/api';
import type { ApiParams } from '@/types/api';
import type { TOKEN_TYPE } from '@/types/jwt';
import { createQueryKeys } from '@/utils/createQueryKeys';
import { queryOptions } from '@tanstack/react-query';

export namespace ChatQueryOptionsParams {
  export interface VerifyToken<TTokenType extends TOKEN_TYPE> {
    tokenType: TTokenType;
    token: string;
  }

  export interface CreateChannelToken {
    guestId: string;
  }
}

export const ChatQueryKey = createQueryKeys('chat', [
  'verifyToken',
  'createChannelToken',
] as const);

export const ChatQueryOptions = {
  verifyToken: <TTokenType extends TOKEN_TYPE>({
    tokenType,
    token,
  }: ChatQueryOptionsParams.VerifyToken<TTokenType>) =>
    queryOptions({
      queryKey: [ChatQueryKey.verifyToken, tokenType, token],
      queryFn: () =>
        API_ROUTES.VERIFY_CHAT_TOKEN({
          tokenType,
          token,
        }),
    }),
  createChannelToken: (params: ApiParams.CREATE_CHAT_CHANNEL_TOKEN) =>
    queryOptions({
      queryKey: [
        ChatQueryKey.createChannelToken,
        params.guestId,
        params.inviteToken,
      ],
      queryFn: () => API_ROUTES.CREATE_CHAT_CHANNEL_TOKEN(params),
    }),
};
