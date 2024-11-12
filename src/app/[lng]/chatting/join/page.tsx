'use client';

import { use, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { useTranslation } from '@/app/i18n/client';
import { ChatQueryOptions } from '@/app/query-options/chat';
import { LoadingTemplate } from '@/components/templates/LoadingTemplate';
import { COOKIES } from '@/constants/cookies-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { chattingRoomTable } from '@/stores/chatting-db.';
import { CustomError, ERROR, ERROR_STATUS } from '@/utils/customError';
import { toast } from '@/utils/toast';
import { useSuspenseQuery } from '@tanstack/react-query';

interface ChattingJoinPageProps {
  searchParams: Promise<{
    inviteToken: string;
  }>;
}

const ChattingJoinPage = (props: ChattingJoinPageProps) => {
  //! useSearchParams 사용시 초기 렌더링 값이 null
  const { inviteToken } = use(props.searchParams);

  const [cookies] = useCookies([COOKIES.USER_ID]);

  const userId = cookies[COOKIES.USER_ID];

  if (!inviteToken || !userId)
    throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['inviteToken', 'userId']));

  const { data } = useSuspenseQuery(
    ChatQueryOptions.createChannelToken({
      guestId: userId,
      inviteToken,
    }),
  );

  if ('error' in data) {
    if (data.error === 'expired')
      throw new CustomError({
        status: ERROR_STATUS.EXPIRED_CHAT,
      });

    throw new CustomError();
  }

  const router = useCustomRouter();

  const { t } = useTranslation('invite-chat-qr');

  useEffect(() => {
    chattingRoomTable.add({
      token: data.channelToken,
      id: data.channelId,
    });

    toast({
      message: t('start-chatting'),
    });

    router.replace(
      ROUTES.CHATTING_ROOM.pathname({ channelId: data.channelId }),
    );
  }, [data, router, t]);

  return <LoadingTemplate />;
};

export default ChattingJoinPage;
