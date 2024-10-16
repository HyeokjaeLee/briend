import { errors, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

import type { LANGUAGE } from '@/constants/language';
import { PRIVATE_ENV } from '@/constants/private-env';
import { ROUTES } from '@/routes/client';
import type { Payload } from '@/types/jwt';

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
    await jwtVerify<Payload.InviteToken>(
      params.inviteToken,
      new TextEncoder().encode(PRIVATE_ENV.AUTH_SECRET),
    );

    return children;
  } catch (e) {
    if (e instanceof errors.JWTExpired)
      return redirect(ROUTES.EXPIRED_CHAT.pathname);

    return redirect(ROUTES.INVITE_CHAT.pathname);
  }
};

export default InviteChatQRLayout;
