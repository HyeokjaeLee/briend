'use client';

import { useShallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { LoadingTemplate } from '@/components';
import { usePeerStore } from '@/stores';
import { CustomError, ERROR } from '@/utils';

interface ChattingTemplateProps {
  userId: string;
}

export const ChattingTemplate = ({ userId }: ChattingTemplateProps) => {
  const [isMounted, friendPeer] = usePeerStore(
    useShallow((state) => [
      state.isMounted,
      state.friendConnections.data.get(userId),
    ]),
  );

  if (!isMounted) return <LoadingTemplate />;

  if (!friendPeer) throw new CustomError(ERROR.UNAUTHORIZED());

  return <article>ss</article>;
};
