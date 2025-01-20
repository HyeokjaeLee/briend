import type { VerifyChatTokenApiParams } from '../api/chat/verify/[tokenType]/route';
import { API_ROUTES } from '@/routes/api';
import type { ApiParams } from '@/types/api-params';
import type { TOKEN_TYPE } from '@/types/jwt';
import { customQueryOption } from '@/utils/customQueryOption';

export const ChatQueryOptions = {
  createFriend: customQueryOption((params: ApiParams.CREATE_FRIEND) => ({
    queryFn: () => API_ROUTES.CREATE_FRIEND(params),
    staleTime: 120_000,
    retry: false,
  })),
  verifyChatToken: customQueryOption(
    (params: VerifyChatTokenApiParams<TOKEN_TYPE>) => ({
      queryFn: () => API_ROUTES.VERIFY_CHAT_TOKEN(params),
      staleTime: 120_000,
      retry: false,
    }),
  ),
};
