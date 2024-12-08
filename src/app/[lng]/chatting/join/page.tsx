'use client';

import { use, useEffect } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { ChatQueryOptions } from '@/app/query-options/chat';
import { LoadingTemplate } from '@/components/templates/LoadingTemplate';
import { COOKIES } from '@/constants/cookies';
import { useCookies } from '@/hooks/useCookies';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { friendTable } from '@/stores/indexed-db';
import { createOnlyClientComponent } from '@/utils/createOnlyClientComponent';
import { CustomError, ERROR, ERROR_STATUS } from '@/utils/customError';
import { toast } from '@/utils/toast';
import { useSuspenseQuery } from '@tanstack/react-query';

interface ChattingJoinPageProps {
  searchParams: Promise<{
    inviteToken: string;
  }>;
}

const ChattingJoinPage = createOnlyClientComponent(
  (props: ChattingJoinPageProps) => {
    //! useSearchParams 사용시 초기 렌더링 값이 null
    const { inviteToken } = use(props.searchParams);

    const [cookies] = useCookies([COOKIES.USER_ID]);

    const userId = cookies.USER_ID;

    if (!inviteToken || !userId)
      throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['inviteToken', 'userId']));

    const { data } = useSuspenseQuery(
      ChatQueryOptions.createFriend({
        guestId: userId,
        inviteToken,
      }),
    );

    const router = useCustomRouter();

    const { t } = useTranslation('invite-chat-qr');

    useEffect(() => {
      if (!friendTable)
        throw new CustomError({
          status: ERROR_STATUS.UNKNOWN_VALUE,
          message: 'friend Table not found',
        });

      friendTable.put(data);

      toast({
        message: t('start-chatting'),
      });

      router.replace(ROUTES.CHATTING_ROOM.pathname({ userId: data.userId }));
    }, [data, router, t]);

    return <LoadingTemplate />;
  },
);

export default ChattingJoinPage;
