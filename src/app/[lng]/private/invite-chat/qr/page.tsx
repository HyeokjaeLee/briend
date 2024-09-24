'use client';

import type { QrInfo } from '../_components/InviteForm';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { QR } from '@/components/QR';
import { Timer } from '@/components/Timer';
import { COOKIES } from '@/constants/cookies-key';
import { toast } from '@/utils';
import { Spinner } from '@radix-ui/themes';

const expireInvite = () => {
  toast({
    message: 'QR code is expired',
  });

  setTimeout(() => history.back(), 1_000);
};

const InviteChatQRPage = () => {
  const [cookies] = useCookies([COOKIES.QR_INFO]);

  const qrInfo: undefined | QrInfo = cookies[COOKIES.QR_INFO];

  const [expires, setExpires] = useState<Date>();

  useEffect(() => {
    if (!qrInfo) return expireInvite();

    setExpires(new Date(qrInfo.expires));
  }, [qrInfo]);

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
          onChangeLeftSeconds={(leftSec) => {
            if (leftSec === 0) {
              expireInvite();
            }
          }}
        />
      </section>
    </article>
  );
};

export default InviteChatQRPage;
