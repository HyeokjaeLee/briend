'use client';

import { HistoryItem } from './components/HistoryItem';
import { useChattingRoomHistoryList } from './hooks/useChattingRoomHistoryList';

const ChatHistoryPage = () => {
  const chattingRoomHistoryList = useChattingRoomHistoryList();

  return (
    <main className="max-w-3xl mx-auto">
      <ul>
        {chattingRoomHistoryList.map((chattingRoomHistory) => (
          <HistoryItem
            {...chattingRoomHistory}
            key={chattingRoomHistory.token}
          />
        ))}
      </ul>
    </main>
  );
};

export default ChatHistoryPage;
