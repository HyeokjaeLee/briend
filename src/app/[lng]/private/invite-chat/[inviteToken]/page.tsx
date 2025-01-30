import { errors } from 'jose';

import { ROUTES } from '@/routes/client';
import type { JwtPayload } from '@/types/jwt';
import { CustomError } from '@/utils';
import { jwtSecretVerify } from '@/utils/api';

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

    return (
      <InviteChatQRTemplate
        exp={payload.exp}
        guestLanguage={payload.guestLanguage}
        hostId={payload.hostId}
        inviteToken={inviteToken}
        url={
          ROUTES.JOIN_CHAT.url({
            lng: payload.guestLanguage,
            searchParams: {
              inviteToken,
            },
          }).href
        }
      />
    );
  } catch (e) {
    if (e instanceof errors.JWTExpired)
      throw new CustomError({
        code: 'EXPIRED_CHAT',
      });

    throw e;
  }
};

export default InviteChatQRPage;
