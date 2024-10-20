import { errors } from 'jose';

import type { LANGUAGE } from '@/constants/language';
import type { Payload } from '@/types/jwt';
import { jwtSecretVerify } from '@/utils/api/jwtSecretVerify';
import { CustomError, ERROR_STATUS } from '@/utils/customError';

interface InviteChatQRLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lng: LANGUAGE;
    inviteToken: string;
  }>;
}

const InviteChatQRLayout = async (props: InviteChatQRLayoutProps) => {
  const params = await props.params;

  const { children } = props;

  try {
    await jwtSecretVerify<Payload.InviteToken>(params.inviteToken);

    return children;
  } catch (e) {
    if (e instanceof errors.JWTExpired)
      throw new CustomError({
        status: ERROR_STATUS.EXPIRED_CHAT,
      });

    throw e;
  }
};

export default InviteChatQRLayout;
