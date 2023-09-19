import dayjs from 'dayjs';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'react-feather';

import { LeftTimer } from '@/components/LeftTimer';
import { LANGUAGE } from '@/constants';
import { Button } from '@hyeokjaelee/pastime-ui';

import type { ChattingRoomHistory } from '../hooks/useChattingRoomHistoryList';

export const HistoryItem = ({
  token,
  opponentName,
  opponentLanguage,
  startAt,
  endAt,
  lastMessage,
}: ChattingRoomHistory) => {
  const lastMessageText = lastMessage?.message?.KO;
  const isExpired = endAt < new Date();
  const router = useRouter();

  return (
    <li
      key={token}
      className={`flex items-center border-zinc-300 dark:border-zinc-700 border-b-2 ${
        isExpired
          ? 'text-zinc-400 dark:text-zinc-600'
          : 'text-zinc-600 dark:text-gray-50'
      } last:border-none`}
    >
      <Link
        href={`/chat/${token}`}
        className="flex p-4 gap-4 items-center flex-1"
      >
        <span className="text-3xl">
          {
            {
              [LANGUAGE.KOREAN]: '🇰🇷',
              [LANGUAGE.ENGLISH]: '🇺🇸',
              [LANGUAGE.JAPANESE]: '🇯🇵',
            }[opponentLanguage]
          }
        </span>
        <section className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <h3 className="text-lg whitespace-nowrap overflow-hidden text-ellipsis">
              {opponentName}
            </h3>
            <div className="flex justify-center items-center gap-2">
              <small>{dayjs(startAt).format('YYYY. MM. DD')}</small>
              <LeftTimer size="small" endAt={endAt} />
            </div>
          </div>
          {lastMessageText ? (
            <small className="whitespace-nowrap overflow-hidden text-ellipsis">
              {lastMessageText}
            </small>
          ) : (
            <small>😢 아직 이 친구와 나눈 대화가 없어요!</small>
          )}
        </section>
      </Link>
      <Button
        theme="danger"
        icon={<Trash2 />}
        onClick={() => {
          router.replace(`?delete=${token}`, {
            scroll: false,
          });
        }}
      />
    </li>
  );
};
