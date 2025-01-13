'use client';

import { CustomBottomNav, LoadingTemplate } from '@/components';
import { useCheckIndividualPeer } from '@/hooks';

import { ChattingList } from './_components/ChattingList';
import { SendMessageForm } from './_components/SendMessageForm';
import { useMessageForm } from './_hooks/useMessageForm';

interface ChattingTemplateProps {
  userId: string;
}

export const ChattingTemplate = ({ userId }: ChattingTemplateProps) => {
  const { form } = useMessageForm();

  const { friendPeer } = useCheckIndividualPeer(userId);

  if (!friendPeer) return <LoadingTemplate />;

  return (
    <article className="size-full">
      <ChattingList friendUserId={userId} />
      <CustomBottomNav className="border-t-0 bg-white p-3">
        <SendMessageForm
          form={form}
          friendPeer={friendPeer}
          friendUserId={userId}
        />
      </CustomBottomNav>
    </article>
  );
};
