'use client';

import { useShallow } from 'zustand/shallow';

import { CustomBottomNav, LoadingTemplate } from '@/components';
import { useCheckIndividualPeer } from '@/hooks';
import { usePeerStore } from '@/stores';
import { CustomError, ERROR } from '@/utils';

import { ChattingList } from './ChattingList';
import { SendMessageForm } from './SendMessageForm';
import { useMessageForm } from './_hooks/useMessageForm';

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
  const { form } = useMessageForm();

  const { isLoading } = useCheckIndividualPeer(userId);

  if (!isMounted || isLoading) return <LoadingTemplate />;

  if (!friendPeer) throw new CustomError(ERROR.UNAUTHORIZED());

  return (
    <article className="size-full">
      <ChattingList />
      <CustomBottomNav className="border-t-0 bg-white p-3">
        <SendMessageForm form={form} />
      </CustomBottomNav>
    </article>
  );
};
