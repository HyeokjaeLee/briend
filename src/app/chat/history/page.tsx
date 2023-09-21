'use client';

import { EmptyHistoryTemplate } from './components/EmptyHistoryTemplate';
import { HistoryDeleteModal } from './components/HistoryDeleteModal';
import { HistoryItem } from './components/HistoryItem';
import { useChattingRoomHistoryList } from './hooks/useChattingRoomHistoryList';

const ChatHistoryPage = () => {
  const chattingRoomHistoryList = useChattingRoomHistoryList();
  const isHistoryEmpty = chattingRoomHistoryList.length === 0;
  return (
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
  );
};

export default ChatHistoryPage;
