import Image from 'next/image';

import { PATH } from '@/constants';

interface QRProps {
  token: string;
}

export const InviteQR = ({ token }: QRProps) => {
  const size = 300;
  return (
    <Image
      className="rounded-3xl"
      src={`https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=${process.env.NEXT_PUBLIC_BASE_URL}${PATH.CHAT}/${token}`}
      alt="invite-qr"
      width={size}
      height={size}
    />
  );
};
