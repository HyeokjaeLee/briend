import { ChattingList } from './_components/ChattingList';
import { SendMessageForm } from './_components/SendMessageForm';
import { useReceiverData } from './_hooks/useReceiverData';

interface ChattingSideProps {
  userId: string;
}

export const ChattingSide = ({ userId }: ChattingSideProps) => {
  const receiverData = useReceiverData(userId);

  if (!receiverData) return null;

  const { name, profileImage } = receiverData;

  return (
    <article className="flex size-full flex-col bg-white">
      <nav className="flex h-14 items-center justify-between gap-5 px-5">
        <div className="flex-center w-fit gap-3">
          <h1 className="truncate text-nowrap font-semibold">{name}</h1>
        </div>
      </nav>
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
