'use client';

import { HistoryDeleteModal } from './components/HistoryDeleteModal';
import { HistoryItem } from './components/HistoryItem';
import { useChattingRoomHistoryList } from './hooks/useChattingRoomHistoryList';

const ChatHistoryPage = () => {
  const chattingRoomHistoryList = useChattingRoomHistoryList();

  return (
    <>
      <article className="max-w-3xl mx-auto">
        <ul>
          {chattingRoomHistoryList.map((chattingRoomHistory) => (
            <HistoryItem
              {...chattingRoomHistory}
              key={chattingRoomHistory.token}
            />
          ))}
        </ul>
      </article>
      <HistoryDeleteModal />
    </>
  );
};

export default ChatHistoryPage;
