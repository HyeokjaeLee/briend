'use client';

import { useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { useTranslation } from '@/app/i18n/client';
import { COOKIES } from '@/constants/cookies-key';
import type { LANGUAGE } from '@/constants/language';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { ROUTES } from '@/routes/client';
import { toast } from '@/utils';
import { Spinner } from '@radix-ui/themes';

interface InvitedChatEnterPageProps {
  params: { hostId: string };
  searchParams: {
    expires?: number;
  };
}

const InvitedChatEnterPage = ({
  params: { hostId },
  searchParams: { expires },
}: InvitedChatEnterPageProps) => {
  const [cookies] = useCookies([COOKIES.USER_ID]);

  const router = useCustomRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      toast({
        message: '채팅에 참여하지 못했어요!',
        type: 'fail',
      }).then(() => router.replace(ROUTES.CHATTING_LIST.pathname));
    }, 5_000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <article className="flex flex-1 items-center justify-center">
      <Spinner size="3" />
    </article>
  );
};

export default InvitedChatEnterPage;
