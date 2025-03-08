'use client';

import { useParams } from 'next/navigation';

import { CommonSkeleton, CustomBottomNav } from '@/components';
import { CustomError } from '@/utils';

import { ChattingList } from './_components/ChattingList';
import { ChattingPageHeader } from './_components/ChattingPageHeader';
import { SendMessageForm } from './_components/SendMessageForm';
import { useReceiverData } from './_hooks/useReceiverData';

export default function ChattingPage() {
  const { userId } = useParams();

  if (typeof userId !== 'string') throw new CustomError();

  const receiverData = useReceiverData(userId);

  if (!receiverData)
    return (
      <div className="size-full">
        <CommonSkeleton />
      </div>
    );

  const { name, profileImage } = receiverData;

  return (
    <article className="size-full">
      <ChattingPageHeader userId={userId} name={name} />
      <ChattingList
        receiverId={userId}
        receiverNickname={name}
        receiverProfileImage={profileImage}
      />
      <CustomBottomNav className="border-t-0 bg-white p-3">
        <SendMessageForm receiverId={userId} />
      </CustomBottomNav>
    </article>
  );
}
