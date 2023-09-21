import { LANGUAGE_PACK } from '@/constants';
import { useChattingDataStore } from '@/store/useChattingDataStore';
import { useGlobalStore } from '@/store/useGlobalStore';

export const EmptyMessageTemplate = () => {
  const chattingRoom = useChattingDataStore((state) => state.chattingRoom);
  const deviceLanguage = useGlobalStore((state) => state.deviceLanguage);
  return (
    <section className="flex-1 flex justify-center items-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-6xl">😞</div>
        <h1 className="text-xl">
          {
            LANGUAGE_PACK.HISTORY_NEVER_CHATTED[
              chattingRoom?.userLanguage ?? deviceLanguage
            ]
          }
        </h1>
      </div>
    </section>
  );
};
