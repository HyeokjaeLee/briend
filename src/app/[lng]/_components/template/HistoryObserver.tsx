'use client';

import { useSearchParams } from 'next/navigation';
import { shallow } from 'zustand/shallow';

import { useLayoutEffect } from 'react';

import { SESSION } from '@/constants/storage-key';
import { getHistorySession, useHistoryStore } from '@/stores/history';

export const HistoryObserver = () => {
  const search = useSearchParams().toString();

  const [
    historyId,
    setHistoryIndex,
    lastRouteType,
    setIsLoading,
    setLastRouteType,
    reset,
  ] = useHistoryStore(
    (state) => [
      state.historyId,
      state.setHistoryIndex,
      state.lastRouteType,
      state.setIsLoading,
      state.setLastRouteType,
      state.reset,
    ],
    shallow,
  );

  useLayoutEffect(() => {
    if (!historyId) return;

    const historySession = getHistorySession();

    const initLoading = () => setIsLoading(true);

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
  }, [
    historyId,
    reset,
    setHistoryIndex,
    setIsLoading,
    setLastRouteType,
    lastRouteType,
    search,
  ]);

  return null;
};
