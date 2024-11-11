import { pick } from 'es-toolkit';
import { decodeJwt, errors } from 'jose';
import { cookies } from 'next/headers';

import { API_ROUTES } from '@/routes/api';
import type { Payload } from '@/types/jwt';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';
import { CustomError, ERROR } from '@/utils/customError';

import { ChattingRoomTemplate } from './_components/ChattingRoomTemplate';
import { ChattingBottomTextfield } from './_components/ChattingRoomTemplate/ChattingBottomTextfield';
import { ChattingList } from './_components/ChattingRoomTemplate/ChattingList';
import { ChattingTopNav } from './_components/ChattingRoomTemplate/ChattingTopNav';

interface ChattingPageProps {
  params: Promise<{
    channelId: string;
  }>;
}

const ChattingPage = async (props: ChattingPageProps) => {
  const { channelId } = await props.params;

  return <ChattingRoomTemplate channelId={channelId} />;
};

export default ChattingPage;

/**
 *  const { channelId } = await props.params;

  const cookieStore = await cookies();

  if (!channelToken) throw new CustomError(ERROR.UNAUTHORIZED());

  try {
    await jwtSecretVerify<Payload.ChannelToken>(channelToken);
  } catch (e) {
    if (!(e instanceof errors.JWTExpired))
      throw new CustomError(ERROR.UNAUTHORIZED());
  }

  const channelInfo = decodeJwt<Payload.ChannelToken>(channelToken);

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
 */
