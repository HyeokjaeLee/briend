import { errors, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

import { useTranslation } from '@/app/i18n/server';
import type { LANGUAGE } from '@/constants/language';
import { SECRET_ENV } from '@/constants/secret-env';
import { ROUTES } from '@/routes/client';
import type { Payload } from '@/types/jwt';

interface InviteChatQRLayoutProps {
  children: React.ReactNode;
  params: {
    lng: LANGUAGE;
    inviteToken: string;
  };
}

const InviteChatQRLayout = async ({
  children,
  params,
}: InviteChatQRLayoutProps) => {
  const { t } = await useTranslation('invite-chat-qr', params.lng);

  try {
    await jwtVerify<Payload.InviteToken>(
      params.inviteToken,
      new TextEncoder().encode(SECRET_ENV.AUTH_SECRET),
    );

    return (
      <article className="flex flex-1 flex-col items-center justify-end gap-4 p-4">
        {children}
        <p className="whitespace-pre-line break-keep text-center">
          {t('notice-message')}
        </p>
      </article>
    );
  } catch (e) {
    if (e instanceof errors.JWTExpired)
      return redirect(ROUTES.EXPIRED_CHAT.pathname);

    return redirect(ROUTES.INVITE_CHAT.pathname);
  }
};

export default InviteChatQRLayout;

export const dynamic = 'force-dynamic';
