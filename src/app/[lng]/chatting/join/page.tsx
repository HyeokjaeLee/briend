'use client';

import { use, useEffect } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { ChatQueryOptions } from '@/app/query-options/chat';
import { LoadingTemplate } from '@/components';
import { PEER_PREFIX } from '@/constants';
import { friendTable } from '@/database/indexed-db';
import {
  useAsyncError,
  useCustomRouter,
  useProfileImage,
  useUserId,
} from '@/hooks';
import { ROUTES } from '@/routes/client';
import { useGlobalStore, usePeerStore } from '@/stores';
import { MESSAGE_TYPE, type PeerData } from '@/types/peer-data';
import { assert, CustomError, ERROR } from '@/utils';
import {
  createOnlyClientComponent,
  toast,
  addProfileImageFromPeer,
} from '@/utils/client';
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

    const userId = useUserId();

    if (!inviteToken || !userId)
      throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(['inviteToken', 'userId']));

    const {
      data: { friendToken, friendUserId, myToken },
    } = useSuspenseQuery(
      ChatQueryOptions.createFriend({
        guestId: userId,
        inviteToken,
      }),
    );

    const router = useCustomRouter();

    const { t } = useTranslation('invite-chat-qr');

    const peer = usePeerStore((state) => state.peer);

    const asyncError = useAsyncError();

    const { profileImage } = useProfileImage();

    useEffect(() => {
      if (!peer) return;

      const hostPeerId = PEER_PREFIX + friendUserId;

      const connection = peer.connect(hostPeerId);

      //* 내 정보 발신
      const checkHostHandler = async () => {
        if (userId === friendUserId) return asyncError(ERROR.UNAUTHORIZED());

        assert(friendTable);

        await connection.send(
          {
            id: inviteToken,
            type: MESSAGE_TYPE.ADD_FRIEND,
            data: {
              profileImage,
              token: myToken,
            },
          } satisfies PeerData,
          true,
        );
      };

      connection.on('open', checkHostHandler);

      const errorHandler = (e: Error) => {
        console.error(e);
      };

      connection.on('error', errorHandler);

      //* 친구의 프로필 정보 수신
      const connectHandler = (async ({ id, type, data }: PeerData) => {
        if (type !== MESSAGE_TYPE.ADD_FRIEND || id !== inviteToken) return;

        await friendTable?.put({
          userId: friendUserId,
          friendToken,
        });

        await addProfileImageFromPeer(data.profileImage);

        toast({
          message: t('start-chatting'),
        });

        const toSidePanel = useGlobalStore.getState().hasSidePanel;

        router.replace(
          ROUTES.CHATTING_ROOM.pathname({ userId: friendUserId }),
          {
            toSidePanel,
          },
        );

        if (toSidePanel) router.replace(ROUTES.FRIEND_LIST.pathname);
      }) as (data: unknown) => void;

      connection.on('data', connectHandler);

      const timeout = setTimeout(
        () => router.replace(ROUTES.FRIEND_LIST.pathname),
        15_000,
      );

      return () => {
        connection.off('open', checkHostHandler);
        connection.off('data', connectHandler);

        connection.off('error', errorHandler);

        connection.close();

        clearTimeout(timeout);
      };
    }, [
      asyncError,
      friendToken,
      friendUserId,
      inviteToken,
      myToken,
      peer,
      profileImage,
      router,
      t,
      userId,
    ]);

    return <LoadingTemplate />;
  },
);

export default ChattingJoinPage;
