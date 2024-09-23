'use client';

import type { QrInfo } from '../_components/InviteForm';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BiAlarm } from 'react-icons/bi';

import { COOKIES } from '@/constants/cookies-key';
import { useCustomRouter } from '@/hooks/useCustomRouter';
import { toast } from '@/utils';
import { Spinner } from '@radix-ui/themes';

const InviteChatQRPage = () => {
  const [cookies] = useCookies([COOKIES.QR_INFO]);

  const qrInfo: undefined | QrInfo = cookies[COOKIES.QR_INFO];

  const [leftSeconds, setLeftSeconds] = useState(1);

  useEffect(() => {
    if (!qrInfo) return;

    const timeoutSec = new Date(qrInfo.expires).getTime();

    const interval = setInterval(() => {
      setLeftSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(interval);

          return 0;
        }

        return Math.floor((timeoutSec - new Date().getTime()) / 1_000);
      });
    }, 1_000);

    return () => clearInterval(interval);
  }, [qrInfo]);

  const router = useCustomRouter();

  useEffect(() => {
    if (!qrInfo || leftSeconds <= 0) {
      toast({
        message: 'QR code is expired',
      });

      setTimeout(() => router.back(), 1_000);
    }
  }, [router, leftSeconds, qrInfo]);

  return (
    <article className="flex flex-1 items-center justify-center p-4">
      {qrInfo && 1 < leftSeconds ? (
        <div className="flex items-center gap-2">
          <BiAlarm />
          {Math.floor(leftSeconds / 60)
            .toString()
            .padStart(2, '0')}
          :{(leftSeconds % 60).toString().padStart(2, '0')}
        </div>
      ) : (
        <Spinner size="3" />
      )}
    </article>
  );
};

export default InviteChatQRPage;
