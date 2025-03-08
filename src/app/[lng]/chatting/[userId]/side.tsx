import { CommonSkeleton } from '@/components';

import { ChattingList } from './_components/ChattingList';
import { ChattingPageHeader } from './_components/ChattingPageHeader';
import { SendMessageForm } from './_components/SendMessageForm';
import { useReceiverData } from './_hooks/useReceiverData';

interface ChattingSideProps {
  userId: string;
}

export const ChattingSide = ({ userId }: ChattingSideProps) => {
  const receiverData = useReceiverData(userId);

  if (!receiverData)
    return (
      <div className="size-full">
        <CommonSkeleton />
      </div>
    );

  const { name, profileImage } = receiverData;

  return (
    <article className="flex size-full flex-col bg-white">
      <ChattingPageHeader
        sidePanel
        name={name}
        profileImage={profileImage}
        userId={userId}
      />
      <ChattingList
        receiverId={userId}
        receiverNickname={name}
        receiverProfileImage={profileImage}
      />
      <footer className="p-3">
        <SendMessageForm receiverId={userId} />
      </footer>
    </article>
  );
};
