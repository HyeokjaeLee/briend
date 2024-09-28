'use client';

import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { useTranslation } from '@/app/i18n/client';
import { COOKIES } from '@/constants/cookies-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { toast } from '@/utils';
import { Spinner } from '@radix-ui/themes';

interface InvitedChatEnterPageProps {
  params: { hostId: string };
  searchParams: {
    expires?: number;
    accessToken?: string;
  };
}

const InvitedChatEnterPage = ({
  params: { hostId },
  searchParams: { expires, accessToken },
}: InvitedChatEnterPageProps) => {
  const [cookies] = useCookies([COOKIES.USER_ID]);

  const router = useCustomRouter();

  const { t } = useTranslation('invited-chat-enter');

  useEffect(() => {
    const timeout = setTimeout(() => {
      toast({
        message: t('expired-toast'),
        type: 'fail',
      });

      router.replace(ROUTES.CHATTING_LIST.pathname);
    }, 5_000);

    return () => clearTimeout(timeout);
  }, [router, t]);

  return (
    <article className="flex flex-1 items-center justify-center">
      <Spinner size="3" />
    </article>
  );
};

export default InvitedChatEnterPage;
