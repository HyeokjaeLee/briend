import dayjs from 'dayjs';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Clock, Lock, Trash2, UserPlus } from 'react-feather';

import { LANGUAGE } from '@/constants';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useGlobalStore } from '@/store/useGlobalStore';
import { Button, Modal } from '@hyeokjaelee/pastime-ui';

export const ChattingHistoryModal = () => {
  const [opened, setOpened, setAddChattingRoomModalOpened] = useGlobalStore(
    (state) => [
      state.chattingHistoryModalOpened,
      state.setChattingHistoryModalOpened,
      state.setAddChattingRoomModalOpened,
    ],
  );

  const chattingRoomMap = useChattingRoomStore(
    (state) => state.chattingRoomMap,
  );

  const chattingRoomTokenList = [...chattingRoomMap.keys()];

  console.log(chattingRoomTokenList);

  const userId = useAuthStore((state) => state.userId);

  const [nowTime, setNowTime] = useState(new Date());
  useEffect(() => {
    const timer = setTimeout(() => setNowTime(new Date()), 60_000);

    return () => clearTimeout(timer);
  }, []);

  const router = useRouter();

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      className="max-w-2xl w-full"
    >
      <Modal.Header closeButton>이전 대화</Modal.Header>
      <ul className="p-5 max-h-[calc(100vh-180px)] overflow-auto flex-1">
        {chattingRoomTokenList.map((token, index) => {
          const chattingRoom = chattingRoomMap.get(token);

          if (!chattingRoom) return null;

          const isExpired = chattingRoom.endAt < nowTime;
          const leftHour = `${Math.floor(
            (chattingRoom.endAt.getTime() - nowTime.getTime()) / 1000 / 60 / 60,
          )}`;
          const created = dayjs(chattingRoom.startAt).format('YY/MM/DD HH:mm');
          return (
            <li
              key={index}
              className="flex justify-between items-center border-b-slate-50 border-b-[1px] p-3 last:border-none cursor-pointer hover:bg-slate-500 transition-colors"
              onClick={() => {
                router.push(
                  `/${
                    userId === chattingRoom.hostId ? 'private' : 'guest'
                  }/chat?token=${token}`,
                );
                setOpened(false);
              }}
            >
              <h3 className="font-semibold text-xl">
                {
                  {
                    [LANGUAGE.ENGLISH]: '🇺🇸',
                    [LANGUAGE.JAPANESE]: '🇯🇵',
                    [LANGUAGE.KOREAN]: '🇰🇷',
                  }[chattingRoom.guestLanguage]
                }{' '}
                {chattingRoom.guestName}
              </h3>
              <section className="text-xs">
                <p>{created}</p>
                <div className="flex items-center gap-2">
                  {isExpired ? (
                    <>
                      <Lock size="1em" />
                      만료됨
                    </>
                  ) : (
                    <>
                      <Clock size="1em" />
                      {leftHour}+ 시간 남음
                    </>
                  )}
                </div>
              </section>
              <Button icon={<Trash2 />} theme="danger" />
            </li>
          );
        })}
      </ul>
      <footer className="p-2 mt-5">
        <Button
          icon={<UserPlus />}
          size="large"
          className="w-full"
          onClick={() => {
            setAddChattingRoomModalOpened(true);
            setOpened(false);
          }}
        >
          친구 추가
        </Button>
      </footer>
    </Modal>
  );
};
