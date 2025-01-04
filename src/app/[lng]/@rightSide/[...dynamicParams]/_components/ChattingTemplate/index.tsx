import { SettingButton } from '@/app/[lng]/chatting/[userId]/_components/ChattingPageHeader/SettingButton';
import { ChattingList } from '@/app/[lng]/chatting/[userId]/_components/ChattingTemplate/ChattingList';
import { SendMessageForm } from '@/app/[lng]/chatting/[userId]/_components/ChattingTemplate/SendMessageForm';
import { useMessageForm } from '@/app/[lng]/chatting/[userId]/_components/ChattingTemplate/_hooks/useMessageForm';
import { ConnectionIndicator } from '@/components';
import { useFriendStore, usePeerStore } from '@/stores';

interface ChattingPageProps {
  userId: string;
}

export const ChattingTemplate = ({ userId }: ChattingPageProps) => {
  const { form } = useMessageForm();

  const nickname = useFriendStore(
    (state) =>
      state.friendList.find((friend) => friend.userId === userId)?.nickname,
  );

  const friendPeer = usePeerStore((state) =>
    state.friendConnections.data.get(userId),
  );

  return (
    <article className="flex size-full flex-col bg-white">
      <nav className="flex h-14 items-center justify-between gap-5 px-5">
        <div className="w-fit gap-3 flex-center">
          <h1 className="truncate text-nowrap font-semibold">{nickname}</h1>
          <ConnectionIndicator friendPeer={friendPeer} />
        </div>
        <SettingButton />
      </nav>
      <ChattingList />
      <footer className="p-3">
        <SendMessageForm form={form} />
      </footer>
    </article>
  );
};
