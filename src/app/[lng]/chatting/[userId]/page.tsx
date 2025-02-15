'use client';

import { useParams } from 'next/navigation';

import { CustomBottomNav } from '@/components';
import { CustomError } from '@/utils';

import { ChattingList } from './_components/ChattingList';
import { ChattingPageHeader } from './_components/ChattingPageHeader';
import { SendMessageForm } from './_components/SendMessageForm';
import { useReceiverData } from './_hooks/useReceiverData';

export default function ChattingPage() {
  const { userId } = useParams();

  if (typeof userId !== 'string') throw new CustomError();

  const { isLoading, receiver, receiverName } = useReceiverData(userId);

  return (
    <article className="size-full">
      <ChattingPageHeader userId={userId} />
      <ChattingList
        isLoading={isLoading}
        receiverId={userId}
        receiverNickname={receiverName}
        receiverProfileImage={receiver.profileImage}
      />
      <CustomBottomNav className="border-t-0 bg-white p-3">
        <SendMessageForm receiverId={userId} />
      </CustomBottomNav>
    </article>
  );
}
