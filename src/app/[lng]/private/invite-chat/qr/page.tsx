'use client';

import type { QrInfo } from '../_components/InviteForm';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { QR } from '@/components/QR';
import { Timer } from '@/components/Timer';
import { COOKIES } from '@/constants/cookies-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { toast } from '@/utils';
import { Spinner } from '@radix-ui/themes';

const InviteChatQRPage = () => {
  const [cookies, , removeCookies] = useCookies([COOKIES.QR_INFO]);

  const qrInfo: undefined | QrInfo = cookies[COOKIES.QR_INFO];

  const [expires, setExpires] = useState<Date>();

  const router = useCustomRouter();

  useEffect(() => {
    if (!qrInfo) {
      toast({
        message: 'QR code is expired',
      });

      const sleep = setTimeout(() => history.back(), 1_000);

      return () => clearTimeout(sleep);
    }

    setExpires(new Date(qrInfo.expires));
  }, [qrInfo, router]);

  if (!expires || !qrInfo)
    return (
      <article className="flex flex-1 items-center justify-center p-4">
        <Spinner size="3" />
      </article>
    );

  return (
    <article className="flex flex-1 items-center justify-center p-4">
      <section>
        <Timer
          expires={expires}
          onTimeout={() => removeCookies(COOKIES.QR_INFO)}
        />
      </section>
    </article>
  );
};

export default InviteChatQRPage;
