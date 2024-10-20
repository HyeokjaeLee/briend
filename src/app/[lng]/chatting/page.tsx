import { pick } from 'es-toolkit';
import { decodeJwt, errors } from 'jose';
import { cookies } from 'next/headers';

import { COOKIES } from '@/constants/cookies-key';
import type { Payload } from '@/types/jwt';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';
import { CustomError, ERROR } from '@/utils/customError';

import { ChattingBottomTextfield } from './_components/ChattingBottomTextfield';
import { ChattingTopNav } from './_components/ChattingTopNav';

interface ChattingPageProps {
  searchParams: Promise<{
    channelId: string;
  }>;
}

const ChattingPage = async (props: ChattingPageProps) => {
  const searchParams = await props.searchParams;

  const cookieStore = await cookies();

  const channelToken = cookieStore.get(
    `${COOKIES.CHANNEL_PREFIX}${searchParams.channelId}`,
  )?.value;

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
      <ChattingBottomTextfield exp={channelInfo.exp} />
    </article>
  );
};

export default ChattingPage;
