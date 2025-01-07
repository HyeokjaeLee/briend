'use client';

import { use, useEffect } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { ChatQueryOptions } from '@/app/query-options/chat';
import { LoadingTemplate } from '@/components';
import { COOKIES, PEER_PREFIX } from '@/constants';
import { friendTable } from '@/database/indexed-db';
import { useCookies, useCustomRouter } from '@/hooks';
import { ROUTES } from '@/routes/client';
import { usePeerStore } from '@/stores';
import { assert, CustomError, ERROR } from '@/utils';
import { toast, createOnlyClientComponent } from '@/utils/client';
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

    const [{ USER_ID: userId }] = useCookies([COOKIES.USER_ID]);

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

    const peer = usePeerStore((state) => state.peer);

    useEffect(() => {
      if (!peer) return;

      const peerId = PEER_PREFIX + data.friendUserId;

      const connection = peer.connect(peerId);

      const handleConnect = () => {
        if (userId !== data.friendUserId) return;

        assert(friendTable);

        friendTable.put({
          userId: data.friendUserId,
          friendToken: data.friendToken,
        });

        toast({
          message: t('start-chatting'),
        });

        router.replace(
          ROUTES.CHATTING_ROOM.pathname({ userId: data.friendUserId }),
        );
      };

      connection.on('open', handleConnect);

      return () => {
        connection.off('open', handleConnect);
      };
    }, [data, router, t, peer, userId]);

    return <LoadingTemplate />;
  },
);

export default ChattingJoinPage;
