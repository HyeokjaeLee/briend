'use client';

import { useAuthStore } from '@/store/useAuthStore';

import { EmptyHistoryTemplate } from './components/EmptyHistoryTemplate';
import { HistoryDeleteModal } from './components/HistoryDeleteModal';
import { HistoryItem } from './components/HistoryItem';
import { useChattingRoomHistoryList } from './hooks/useChattingRoomHistoryList';

const ChatHistoryPage = () => {
  const chattingRoomHistoryList = useChattingRoomHistoryList();
  const isHistoryEmpty = chattingRoomHistoryList.length === 0;
  const isBinded = useAuthStore((state) => state.isBinded);
  return isBinded ? (
    <>
      <article className="max-w-3xl mx-auto h-full">
        {isHistoryEmpty ? (
          <EmptyHistoryTemplate />
        ) : (
          <ul>
            {chattingRoomHistoryList.map((chattingRoomHistory) => (
              <HistoryItem
                {...chattingRoomHistory}
                key={chattingRoomHistory.token}
              />
            ))}
          </ul>
        )}
      </article>
      <HistoryDeleteModal />
    </>
  ) : null;
};

export default ChatHistoryPage;
