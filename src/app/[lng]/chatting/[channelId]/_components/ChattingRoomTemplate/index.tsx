'use client';

import type { Channel } from 'pusher-js';

import { useLiveQuery } from 'dexie-react-hooks';
import { pick } from 'es-toolkit';
import { useSession } from 'next-auth/react';

import { useCallback, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { pusher } from '@/app/pusher/client';
import { ChatQueryOptions } from '@/app/query-options/chat';
import { LoadingTemplate } from '@/components/templates/LoadingTemplate';
import { PUSHER_CHANNEL } from '@/constants/channel';
import { COOKIES } from '@/constants/cookies-key';
import { chattingRoomTable } from '@/stores/chatting-db.';
import { TOKEN_TYPE } from '@/types/jwt';
import { CustomError, ERROR_STATUS } from '@/utils/customError';
import { toast } from '@/utils/toast';
import { useSuspenseQuery } from '@tanstack/react-query';

import { ChattingBottomTextfield } from './ChattingBottomTextfield';
import { ChattingList } from './ChattingList';
import { ChattingTopNav } from './ChattingTopNav';

interface ChattingRoomTemplateProps {
  channelId: string;
}

interface ChattingRoomContentProps {
  channelToken: string;
}

const ChattingRoomContent = ({ channelToken }: ChattingRoomContentProps) => {
  const [cookies] = useCookies([COOKIES.USER_ID]);

  const userId = cookies[COOKIES.USER_ID];

  const channelTokenQuery = useSuspenseQuery({
    ...ChatQueryOptions.verifyToken({
      token: channelToken,
      tokenType: TOKEN_TYPE.CHANNEL,
    }),
    select: ({ payload, isExpired }) => {
      const channelInfo =
        userId === payload.hostId
          ? {
              myInfo: {
                name: payload.hostNickname,
                emoji: payload.hostEmoji,
                id: payload.hostId,
              },
              otherInfo: {
                name: payload.guestNickname,
                emoji: payload.guestEmoji,
                id: payload.guestId,
              },
            }
          : {
              myInfo: {
                name: payload.guestNickname,
                emoji: payload.guestEmoji,
                id: payload.guestId,
              },
              otherInfo: {
                name: payload.hostNickname,
                emoji: payload.hostEmoji,
                id: payload.hostId,
              },
            };

      if (!payload.exp)
        throw new CustomError({
          status: ERROR_STATUS.UNAUTHORIZED,
          message: 'invalid-channel',
        });

      return {
        channelInfo,
        isExpired,
        hostId: payload.hostId,
        channelId: payload.channelId,
        expires: new Date((payload.exp ?? 0) * 1_000),
      };
    },
  });

  const {
    isExpired,
    expires,
    channelInfo: { myInfo, otherInfo },
    hostId,
    channelId,
  } = channelTokenQuery.data;

  const [channel, setChannel] = useState<Channel>();

  useEffect(() => {
    if (isExpired) {
      setChannel(undefined);

      return toast({
        message: 'expired-chat',
      });
    }

    const channel = pusher.subscribe(PUSHER_CHANNEL.CHATTING(hostId));

    setChannel(channel);

    return () => {
      channel.unsubscribe();
    };
  }, [channelId, hostId, isExpired]);

  return (
    <article className="relative flex flex-1 flex-col">
      <ChattingTopNav
        expires={expires}
        otherName={otherInfo.name}
        onTimeout={channelTokenQuery.refetch}
      />
      <ChattingList channelId={channelId} myId={myInfo.id} />
      <ChattingBottomTextfield
        channel={channel}
        channelId={channelId}
        channelToken={channelToken}
        isExpired={isExpired}
        myId={myInfo.id}
        otherId={otherInfo.id}
      />
    </article>
  );
};

/**
 * 
 * @param param0  <ChattingList
        {...pick(channelInfo, ['hostId', 'channelId'])}
        channelToken={channelToken}
      />
     
 * @returns 
 */

export const ChattingRoomTemplate = ({
  channelId,
}: ChattingRoomTemplateProps) => {
  const channelToken = useLiveQuery(
    () => chattingRoomTable.get(channelId),
    [channelId],
    'loading',
  );

  if (channelToken === 'loading') return null;

  if (!channelToken)
    throw new CustomError({
      status: ERROR_STATUS.UNAUTHORIZED,
      // TODO: 추후 번역 메시지
      message: 'invalid-channel',
    });

  return <ChattingRoomContent channelToken={channelToken.token} />;
};
