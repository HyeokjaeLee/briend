'use client';

import type { Channel } from 'pusher-js';

import { useLiveQuery } from 'dexie-react-hooks';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { useTranslation } from '@/app/i18n/client';
import { pusher } from '@/app/pusher/client';
import { ChatQueryOptions } from '@/app/query-options/chat';
import { PUSHER_CHANNEL } from '@/constants/channel';
import { COOKIES } from '@/constants/cookies-key';
import { chattingRoomTable } from '@/stores/chatting-db.';
import { TOKEN_TYPE } from '@/types/jwt';
import { CustomError, ERROR_STATUS } from '@/utils/customError';
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
                language: payload.hostLanguage,
              },
              otherInfo: {
                name: payload.guestNickname,
                emoji: payload.guestEmoji,
                id: payload.guestId,
                language: payload.guestLanguage,
              },
            }
          : {
              myInfo: {
                name: payload.guestNickname,
                emoji: payload.guestEmoji,
                id: payload.guestId,
                language: payload.guestLanguage,
              },
              otherInfo: {
                name: payload.hostNickname,
                emoji: payload.hostEmoji,
                id: payload.hostId,
                language: payload.hostLanguage,
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
    if (isExpired) return setChannel(undefined);

    const channel = pusher.subscribe(PUSHER_CHANNEL.CHATTING(hostId));

    setChannel(channel);

    return () => {
      channel.unsubscribe();
    };
  }, [channelId, hostId, isExpired]);

  const [isMyLanguage, setIsMyLanguage] = useState(true);

  return (
    <article className="relative flex flex-1 flex-col">
      <ChattingTopNav
        isMyLanguage={isMyLanguage}
        myLanguage={myInfo.language}
        otherLanguage={otherInfo.language}
        otherName={otherInfo.name}
        onToggleLanguage={setIsMyLanguage}
      />
      <ChattingList
        channel={channel}
        channelId={channelId}
        isMyLanguage={isMyLanguage}
        myId={myInfo.id}
        otherEmoji={otherInfo.emoji}
        otherName={otherInfo.name}
      />
      <ChattingBottomTextfield
        channel={channel}
        channelId={channelId}
        channelToken={channelToken}
        expires={expires}
        isExpired={isExpired}
        myId={myInfo.id}
        otherId={otherInfo.id}
        onTimeout={channelTokenQuery.refetch}
      />
    </article>
  );
};

export const ChattingRoomTemplate = ({
  channelId,
}: ChattingRoomTemplateProps) => {
  const channelToken = useLiveQuery(
    () => chattingRoomTable.get(channelId),
    [channelId],
    'loading',
  );

  const { t } = useTranslation('chatting');

  if (channelToken === 'loading') return null;

  if (!channelToken)
    throw new CustomError({
      status: ERROR_STATUS.UNAUTHORIZED,
      message: t('invalid-channel'),
    });

  return <ChattingRoomContent channelToken={channelToken.token} />;
};
