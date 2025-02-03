import { useCallback } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { trpc } from '@/app/trpc';
import { useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore } from '@/stores';
import { CustomError, singleton } from '@/utils';
import { toast } from '@/utils/client';

export const useJoinChat = () => {
  const joinChatMutation = trpc.chat.joinChat.useMutation();
  const { t } = useTranslation('join-chat');

  const router = useCustomRouter();

  const hasSidePanel = useGlobalStore((state) => state.hasSidePanel);

  const handleComplete = useCallback(() => {
    if (!joinChatMutation.isSuccess)
      throw new CustomError('handleComplete failed');

    router.replace(
      ROUTES.CHATTING_ROOM.pathname({
        userId: joinChatMutation.data.hostUserId,
      }),
      {
        toSidePanel: hasSidePanel,
      },
    );

    if (hasSidePanel) {
      router.replace(ROUTES.FRIEND_LIST.pathname);
    }

    toast({
      message: t('start-chatting-toast-message'),
    });
  }, [
    hasSidePanel,
    joinChatMutation.data,
    joinChatMutation.isSuccess,
    router,
    t,
  ]);

  return {
    joinChatMutation,
    handleComplete,
  };
};
