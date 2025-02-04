'use client';

import { CustomBottomNav } from '@/components';

import { ChattingList } from './_components/ChattingList';
import { SendMessageForm } from './_components/SendMessageForm';

interface ChattingTemplateProps {
  userId: string;
}

export const ChattingTemplate = ({ userId }: ChattingTemplateProps) => {
  return (
    <article className="size-full">
      <ChattingList friendUserId={userId} />
      <CustomBottomNav className="border-t-0 bg-white p-3">
        <SendMessageForm />
      </CustomBottomNav>
    </article>
  );
};
