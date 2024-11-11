'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { pick } from 'es-toolkit';

import { ChatQueryOptions } from '@/app/query-options/chat';
import { LoadingTemplate } from '@/components/templates/LoadingTemplate';
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
  const { data } = useSuspenseQuery(
    ChatQueryOptions.verifyToken({
      token: channelToken,
      tokenType: TOKEN_TYPE.CHANNEL,
    }),
  );

  if (data.isExpired)
    throw new CustomError({
      status: ERROR_STATUS.EXPIRED_CHAT,
      // TODO: 추후 번역 메시지
      message: 'expired-chat',
    });

  const channelInfo = data.payload;

  return (
    <article className="relative flex flex-1 flex-col">
      <ChattingTopNav
        {...pick(channelInfo, ['guestNickname', 'hostId', 'hostNickname'])}
      />
      <ChattingList
        {...pick(channelInfo, ['hostId', 'channelId'])}
        channelToken={channelToken}
      />
      <ChattingBottomTextfield
        {...pick(channelInfo, ['hostId', 'guestId', 'exp'])}
        channelToken={channelToken}
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

  if (channelToken === 'loading') return <LoadingTemplate />;

  if (!channelToken)
    throw new CustomError({
      status: ERROR_STATUS.UNAUTHORIZED,
      // TODO: 추후 번역 메시지
      message: 'invalid-channel',
    });

  return <ChattingRoomContent channelToken={channelToken.token} />;
};
