'use client';

import Link from 'next/link';

import { PATH } from '@/constants';

interface DevPreviewLinkProps {
  token: string;
}

export const DevPreviewLink = ({ token }: DevPreviewLinkProps) =>
  process.env.NODE_ENV === 'development' ? (
    <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}${PATH.CHAT}/${token}`}>
      개발자 미리보기
    </Link>
  ) : null;
