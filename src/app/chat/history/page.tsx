'use client';

import dayjs from 'dayjs';

import { useRouter } from 'next/navigation';

import { LeftTimer } from '@/components/LeftTimer';
import { LANGUAGE } from '@/constants';

import { useChattingRoomHistory } from './hooks/useChattingRoomHistory';

const ChatHistoryPage = () => {
  const chattingRoomHistoryList = useChattingRoomHistory();
  const router = useRouter();

  return (
    <main className="max-w-3xl mx-auto">
      <ul>
        {chattingRoomHistoryList.map((chattingRoomHistory) => {
          const lastMessage = chattingRoomHistory.lastMessage?.message?.KO;
          const isExpired = chattingRoomHistory.endAt < new Date();

          return (
            <li
              onClick={() => router.push(`/chat/${chattingRoomHistory.token}`)}
              key={chattingRoomHistory.token}
              className={`flex p-4 border-zinc-300 dark:border-zinc-700 border-b-[1px] gap-4 items-center cursor-pointer ${
                isExpired
                  ? 'text-zinc-400 dark:text-zinc-600'
                  : 'text-zinc-600 dark:text-gray-50'
              }`}
            >
              <span className="text-3xl">
                {
                  {
                    [LANGUAGE.KOREAN]: '🇰🇷',
                    [LANGUAGE.ENGLISH]: '🇺🇸',
                    [LANGUAGE.JAPANESE]: '🇯🇵',
                  }[chattingRoomHistory.opponentLanguage]
                }
              </span>
              <section className="flex flex-col flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
                    {chattingRoomHistory.opponentName}
                  </h3>
                  <div className="flex justify-center items-center gap-2">
                    <small>
                      {dayjs(chattingRoomHistory.startAt).format(
                        'YYYY. MM. DD',
                      )}
                    </small>
                    <LeftTimer size="small" endAt={chattingRoomHistory.endAt} />
                  </div>
                </div>
                {lastMessage ? (
                  <small className="whitespace-nowrap overflow-hidden text-ellipsis">
                    {lastMessage}
                  </small>
                ) : (
                  <small>😢 아직 이 친구와 나눈 대화가 없어요!</small>
                )}
              </section>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default ChatHistoryPage;
