import Image from 'next/image';

import { LogInButton } from '@/components/LogInButton';
import { LANGUAGE_PACK } from '@/constants';
import { useGlobalStore } from '@/store/useGlobalStore';
import TurtleCurious from '@public/assets/resources/turtle-curious.png';

export const EmptyHistoryTemplate = () => {
  const deviceLanguage = useGlobalStore((state) => state.deviceLanguage);

  return (
    <section className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Image
          src={TurtleCurious}
          alt="new-chatting"
          className="w-28 h-28 animate-bounce"
        />
        <h1 className="text-xl">
          {LANGUAGE_PACK.EMPTY_HISTORY[deviceLanguage]}
        </h1>
        <LogInButton />
      </div>
    </section>
  );
};
