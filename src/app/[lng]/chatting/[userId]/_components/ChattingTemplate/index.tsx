'use client';

import { useShallow } from 'zustand/shallow';

import { LoadingTemplate } from '@/components';
import { BackHeader } from '@/components/organisms/BackHeader';
import { usePeerStore } from '@/stores';
import { CustomError, ERROR } from '@/utils';

interface ChattingTemplateProps {
  userId: string;
}

export const ChattingTemplate = ({ userId }: ChattingTemplateProps) => {
  const [isMounted, connection] = usePeerStore(
    useShallow((state) => [
      state.isMounted,
      state.friendConnectionMap.get(userId),
    ]),
  );

  if (!isMounted) return <LoadingTemplate />;

  if (!connection) throw new CustomError(ERROR.UNAUTHORIZED());

  return <article>ss</article>;
};
