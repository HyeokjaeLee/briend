import dayjs from 'dayjs';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Trash2 } from 'react-feather';

import { LANGUAGE, LANGUAGE_PACK } from '@/constants';
import { useGlobalStore } from '@/store/useGlobalStore';
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
  const deviceLanguage = useGlobalStore((state) => state.deviceLanguage);

  return (
    <li
      key={token}
      className={`flex items-center gap-5 border-zinc-300 dark:border-zinc-700 border-b-2 p-4 ${
        isExpired
          ? 'text-zinc-400 dark:text-zinc-600'
          : 'text-zinc-600 dark:text-gray-50'
      } last:border-none`}
    >
      <Link href={`/chat/${token}`} className="flex gap-4 items-center flex-1">
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
              {isExpired ? (
                <Lock className="inline-block w-4 h-4 mr-2" />
              ) : null}
              {opponentName}
            </h3>
            <div className="flex justify-center items-center gap-2">
              <small className="font-normal text-xs">
                {dayjs(startAt).format('YY. MM. DD')}
              </small>
            </div>
          </div>
          {lastMessageText ? (
            <small className="whitespace-nowrap overflow-hidden text-ellipsis">
              {lastMessageText}
            </small>
          ) : (
            <small>
              😢 {LANGUAGE_PACK.HISTORY_NEVER_CHATTED[deviceLanguage]}
            </small>
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
