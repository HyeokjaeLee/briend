import { ConnectionIndicator, LoadingTemplate } from '@/components';
import { useCheckIndividualPeer } from '@/hooks';
import { useFriendStore } from '@/stores';

import { SettingButton } from './_components/ChattingPageHeader/_components/SettingButton';
import { ChattingList } from './_components/ChattingTemplate/_components/ChattingList';
import { SendMessageForm } from './_components/ChattingTemplate/_components/SendMessageForm';

interface ChattingSideProps {
  userId: string;
}

export const ChattingSide = ({ userId }: ChattingSideProps) => {
  const nickname = useFriendStore(
    (state) =>
      state.friendList.find((friend) => friend.userId === userId)?.nickname,
  );

  const { friendPeer } = useCheckIndividualPeer(userId);

  if (!friendPeer) return <LoadingTemplate />;

  return (
    <article className="flex size-full flex-col bg-white">
      <nav className="flex h-14 items-center justify-between gap-5 px-5">
        <div className="w-fit gap-3 flex-center">
          <h1 className="truncate text-nowrap font-semibold">{nickname}</h1>
          <ConnectionIndicator friendPeer={friendPeer} />
        </div>
        <SettingButton />
      </nav>
      <ChattingList friendUserId={userId} />
      <footer className="p-3">
        <SendMessageForm />
      </footer>
    </article>
  );
};
