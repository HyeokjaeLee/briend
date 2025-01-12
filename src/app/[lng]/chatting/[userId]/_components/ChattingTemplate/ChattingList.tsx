import { Virtuoso } from 'react-virtuoso';

import { useTranslation } from '@/app/i18n/client';
import { Lottie } from '@/components';

import EmptyLottie from './_assets/empty.json';
import { useMessageSync } from './_hooks/useMessageSync';
interface ChattingListProps {
  friendUserId: string;
}

export const ChattingList = ({ friendUserId }: ChattingListProps) => {
  const { t } = useTranslation('chatting');
  const { messageList } = useMessageSync(friendUserId);

  if (!messageList?.length)
    return (
      <div className="size-full flex-col gap-12 p-4 flex-center">
        <Lottie loop animationData={EmptyLottie} className="w-full" />
        <section className="text-center text-slate-500">
          <h3 className="text-xl font-semibold">{t('empty-title')}</h3>
          <p>{t('empty-description')}</p>
        </section>
      </div>
    );

  return (
    <Virtuoso
      className="h-full"
      data={messageList}
      followOutput="smooth" // 새 메시지가 오면 자동 스크롤
      initialTopMostItemIndex={messageList.length - 1} // 최신 메시지부터 보여주기
      itemContent={(index, message) => (
        <div className="p-2">
          <p>{message.message}</p>
        </div>
      )}
    />
  );
};
