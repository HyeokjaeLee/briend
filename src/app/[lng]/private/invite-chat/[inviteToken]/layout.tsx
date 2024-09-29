import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

import type { InviteTokenPayload } from '@/app/api/chat/create/route';
import { useTranslation } from '@/app/i18n/server';
import type { LANGUAGE } from '@/constants/language';
import { SECRET_ENV } from '@/constants/secret-env';
import { ROUTES } from '@/routes/client';

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
    await jwtVerify<InviteTokenPayload>(
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
  } catch {
    return redirect(ROUTES.INVITE_CHAT.pathname);
  }
};

export default InviteChatQRLayout;
