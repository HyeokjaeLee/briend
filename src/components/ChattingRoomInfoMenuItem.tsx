import { useChattingRoomStore } from '@/hooks/useChattingRoomStore';

export const ChattingRoomInfoMenuItem = () => {
  const chattingRoom = useChattingRoomStore((state) => state.chattingRoom);

  return chattingRoom ? (
    <li className="p-3 box-border bg-slate-300 mx-2 rounded-md text-slate-700">
      <h3 className="text-lg font-bold whitespace-pre-line">
        💬 {chattingRoom.hostName}님과 {chattingRoom.guestName}님의 대화
      </h3>
    </li>
  ) : null;
};
