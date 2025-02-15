import { ChattingList } from './_components/ChattingList';
import { SettingButton } from './_components/ChattingPageHeader/_components/SettingButton';
import { SendMessageForm } from './_components/SendMessageForm';
import { useReceiverData } from './_hooks/useReceiverData';

interface ChattingSideProps {
  userId: string;
}

export const ChattingSide = ({ userId }: ChattingSideProps) => {
  const { isLoading, receiver, receiverName } = useReceiverData(userId);

  return (
    <article className="flex size-full flex-col bg-white">
      <nav className="flex h-14 items-center justify-between gap-5 px-5">
        <div className="w-fit gap-3 flex-center">
          <h1 className="truncate text-nowrap font-semibold">{receiverName}</h1>
        </div>
        <SettingButton />
      </nav>
      <ChattingList
        isLoading={isLoading}
        receiverId={userId}
        receiverNickname={receiverName}
        receiverProfileImage={receiver.profileImage}
      />
      <footer className="p-3">
        <SendMessageForm receiverId={userId} />
      </footer>
    </article>
  );
};
