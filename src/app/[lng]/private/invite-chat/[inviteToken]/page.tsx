import { errors } from 'jose';

import { API_ROUTES } from '@/routes/api';
import { ROUTES } from '@/routes/client';
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

    const url = await API_ROUTES.SHORT_URL(
      'https://vercel.com/hyeokjaelees-projects-6880e108/briend/AmmqNWYfhGmyVyUfnPNQgxXWMsuU/logs?slug=app-future&slug=en-US&slug=hyeokjaelees-projects-6880e108&slug=briend&slug=AmmqNWYfhGmyVyUfnPNQgxXWMsuU&slug=logs&page=3&timeline=past30Minutes&startDate=1732817962913&endDate=1732819762913&levels=error&levels=info&levels=warning&live=true',
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
