'use client';

import { useHistoryStore } from '@/stores/history';
import { cn } from '@/utils';

const Template = ({ children }: { children: React.ReactNode }) => {
  const lastRouteType = useHistoryStore(
    ({ lastRouteType }) => lastRouteType ?? 'reload',
  );

  return (
    <main
      className={cn('flex-1 overflow-auto animate-duration-150', {
        'animate-fade-right': lastRouteType === 'back',
        'animate-fade-left': ['forward', 'push'].includes(lastRouteType),
        'animate-fade': ['replace', 'reload'].includes(lastRouteType),
      })}
    >
      {children}
    </main>
  );
};

export default Template;
