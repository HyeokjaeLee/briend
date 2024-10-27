import { usePathname, useSearchParams } from 'next/navigation';
import { useShallow } from 'zustand/shallow';

import { Suspense, useEffect } from 'react';

import { SESSION_STORAGE } from '@/constants/storage-key';
import { useHistoryStore } from '@/stores/history';

const HistoryObserverController = () => {
  const searchParams = useSearchParams().toString();
  const pathname = usePathname();

  let url = pathname;

  if (searchParams) url += `?${searchParams}`;

  const [setCustomHistory, setHistoryIndex] = useHistoryStore(
    useShallow((state) => [state.setCustomHistory, state.setHistoryIndex]),
  );

  useEffect(() => {
    const { historyIndex, customHistory } = useHistoryStore.getState();

    const historyState: {
      historyIndex?: number;
    } = history.state;

    if (typeof historyState.historyIndex === 'number') {
      customHistory.set(historyState.historyIndex, url);
    } else {
      const hasReplaceMark =
        sessionStorage.getItem(SESSION_STORAGE.REPLACE_MARK) === 'true';

      historyState.historyIndex = historyIndex;

      if (hasReplaceMark) {
        sessionStorage.removeItem(SESSION_STORAGE.REPLACE_MARK);
        customHistory.set(historyIndex, url);
      } else {
        historyState.historyIndex += 1;
        customHistory.set(historyState.historyIndex, url);
      }

      history.replaceState(historyState, '');
    }

    setHistoryIndex(historyState.historyIndex);
    setCustomHistory(customHistory);

    const setHistoryExpire = () => {
      sessionStorage.setItem(
        SESSION_STORAGE.HISTORY_EXPIRE,
        (Date.now() + 5_000).toString(),
      );
    };

    window.addEventListener('beforeunload', setHistoryExpire);

    return () => {
      setHistoryExpire();
      window.removeEventListener('beforeunload', setHistoryExpire);
    };
  }, [url, setCustomHistory, setHistoryIndex]);

  return null;
};

export const HistoryObserver = () => {
  return (
    <Suspense>
      <HistoryObserverController />
    </Suspense>
  );
};
