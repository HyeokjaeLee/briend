'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { shallow } from 'zustand/shallow';

import { useLayoutEffect, useRef } from 'react';

import { SESSION } from '@/constants/storage-key';
import { getHistorySession, useHistoryStore } from '@/stores/history';

export const HistoryObserver = () => {
  const [
    historyId,
    setHistoryIndex,
    lastRouteType,
    setIsLoading,
    setLastRouteType,
    setHistoryId,
    setCustomHistory,
    reset,
  ] = useHistoryStore(
    (state) => [
      state.historyId,
      state.setHistoryIndex,
      state.lastRouteType,
      state.setIsLoading,
      state.setLastRouteType,
      state.setHistoryId,
      state.setCustomHistory,
      state.reset,
    ],
    shallow,
  );

  const pathname = usePathname();
  const search = useSearchParams().toString();

  useLayoutEffect(() => {
    const historySession = getHistorySession();

    if (!historySession) return reset();

    setHistoryId(historySession.id);
    setCustomHistory((prev) =>
      historySession.history.forEach(([index, url]) => {
        prev.set(index, url);
      }),
    );
    setHistoryIndex(historySession.index);
  }, [setCustomHistory, setHistoryId, setHistoryIndex, reset]);

  const isProcessed = useRef(false);

  useLayoutEffect(() => {
    if (!historyId || isProcessed.current) return;

    isProcessed.current = true;
    const historySession = getHistorySession();

    const initLoading = () => {
      isProcessed.current = false;
    };

    if (!historySession) {
      reset();

      return initLoading;
    }

    const indexedHistory = history.state[historyId];

    if (typeof indexedHistory === 'number') {
      if (indexedHistory < historySession.index) {
        setLastRouteType('back');
      } else if (historySession.index < indexedHistory) {
        setLastRouteType('forward');
      } else if (!lastRouteType) {
        setLastRouteType('reload');
      }

      setHistoryIndex(indexedHistory);
    } else if (sessionStorage.getItem(SESSION.REPLACED_MARK) === 'true') {
      sessionStorage.removeItem(SESSION.REPLACED_MARK);
      setLastRouteType('replace');
      setHistoryIndex(historySession.index);
    } else {
      setLastRouteType('push');
      setHistoryIndex(historySession.index + 1);
    }

    setIsLoading(false);

    return initLoading;
  }, [
    historyId,
    reset,
    setHistoryIndex,
    setIsLoading,
    setLastRouteType,
    lastRouteType,
    pathname,
    search,
  ]);

  return null;
};
