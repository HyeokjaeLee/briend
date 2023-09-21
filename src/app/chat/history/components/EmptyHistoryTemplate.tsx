import { LogInButton } from '@/components/LogInButton';
import { LANGUAGE_PACK } from '@/constants';
import { useGlobalStore } from '@/store/useGlobalStore';

export const EmptyHistoryTemplate = () => {
  const deviceLanguage = useGlobalStore((state) => state.deviceLanguage);

  return (
    <section className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-6xl animate-bounce">🥳</div>
        <h1 className="text-xl">
          {LANGUAGE_PACK.EMPTY_HISTORY[deviceLanguage]}
        </h1>
        <LogInButton />
      </div>
    </section>
  );
};
