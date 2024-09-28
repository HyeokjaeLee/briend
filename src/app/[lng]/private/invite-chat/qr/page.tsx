import type { QrInfo } from '../_components/InviteForm';

import { cookies } from 'next/headers';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { useTranslation } from '@/app/i18n/client';
import { CustomBottomNav } from '@/components/CustomBottomNav';
import { Timer } from '@/components/Timer';
import { COOKIES } from '@/constants/cookies-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { toast } from '@/utils';
import { Spinner } from '@radix-ui/themes';

import { InviteQRSection } from './_components/InviteQRSection';

const getQrInfo = async () => {
  const cookieStore = cookies();

  const qrInfo = cookieStore.get(COOKIES.QR_INFO);

  return qrInfo;
};

const InviteChatQRPage = async () => {
  const cookieStore = cookies();

  const qrInfo = cookieStore.get(COOKIES.QR_INFO);

  if (!qrInfo) return <></>;

  return <></>;
};

export default InviteChatQRPage;

export const dynamic = 'force-dynamic';

/**
 *   <article className="flex flex-1 flex-col items-center justify-end gap-4 p-4">
      <InviteQRSection
        expires={expires}
        hostId={qrInfo.userId}
        language={qrInfo.language}
      />
      <p className="whitespace-pre-line break-keep text-center">
        {t('notice-message')}
      </p>
      <CustomBottomNav className="flex justify-center">
        <Timer
          expires={expires}
          onTimeout={() => removeCookies(COOKIES.QR_INFO)}
        />
      </CustomBottomNav>
    </article> 
 * 
 *  const [cookies, , removeCookies] = useCookies([COOKIES.QR_INFO]);
  const qrInfo: undefined | QrInfo = cookies[COOKIES.QR_INFO];

  const router = useCustomRouter();

  const { t } = useTranslation('invite-chat-qr');

  const [expires, setExpires] = useState<Date>();

  useEffect(() => {
    if (!qrInfo) {
      toast({
        message: t('expired-toast-message'),
      });

      const sleep = setTimeout(() => router.back(), 1_000);

      return () => clearTimeout(sleep);
    }

    setExpires(new Date(qrInfo.expires));
  }, [qrInfo, router, t]);

  if (!expires || !qrInfo)
    return (
      <article className="flex flex-1 items-center justify-center">
        <Spinner size="3" />
      </article>
    );

 */
