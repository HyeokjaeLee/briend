import { errors } from 'jose';

import { ROUTES } from '@/routes/client';
import { EXTERNAL_PRIVATE_API } from '@/routes/external-private-api';
import type { JwtPayload } from '@/types/jwt';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';
import { CustomError, ERROR_STATUS } from '@/utils/customError';

import { InviteChatQRTemplate } from './_components/InviteChatQrTemplate';

interface InviteChatQRPageProps {
  params: Promise<{
    inviteToken: string;
  }>;
}

const InviteChatQRPage = async (props: InviteChatQRPageProps) => {
  const { inviteToken } = await props.params;

  try {
    const { payload } =
      await jwtSecretVerify<JwtPayload.InviteToken>(inviteToken);

    const url = await EXTERNAL_PRIVATE_API.SHORT_URL(
      ROUTES.JOIN_CHAT.url({
        lng: payload.guestLanguage,
        searchParams: {
          inviteToken,
        },
      }).href,
    );

    return (
      <InviteChatQRTemplate
        exp={payload.exp}
        guestLanguage={payload.guestLanguage}
        hostId={payload.hostId}
        url={url}
      />
    );
  } catch (e) {
    if (e instanceof errors.JWTExpired)
      throw new CustomError({
        status: ERROR_STATUS.EXPIRED_CHAT,
      });

    throw e;
  }
};

export default InviteChatQRPage;
