'use client';

import { shallow } from 'zustand/shallow';

import { Clock } from 'react-feather';

import { LeftTimer } from '@/components/LeftTimer';
import { useAuthStore } from '@/store/useAuthStore';

export const InviteHistoryPage = () => {
  const [chattingRoomMap] = useAuthStore(
    (state) => [state.chattingRoomMap],
    shallow,
  );

  return (
    <main>
      <ul className="flex flex-col gap-3 p-6">
        {[...chattingRoomMap.keys()].map((token) => {
          const chattingRoom = chattingRoomMap.get(token);
          if (!chattingRoom) return null;

          const isExpired = chattingRoom.endAt < new Date();

          return (
            <li
              key={token}
              className="rounded-2xl p-2 border-2 border-zinc-700"
            >
              <h2 className="flex items-center gap-4 font-semibold">
                <div className="rounded-full bg-slate-500 font-black text-slate-50 text-3xl w-10 h-10 flex items-center justify-center">
                  J
                </div>
                {chattingRoom?.hostName}님과 {chattingRoom?.guestName}님의
                채팅방
              </h2>
              {isExpired ? (
                <div>
                  <Clock /> 만료됨
                </div>
              ) : (
                <LeftTimer endAt={chattingRoom?.endAt} />
              )}
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default InviteHistoryPage;
