'use client';

import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { getHistorySession, useHistoryStore } from '@/stores/history';

export const HistorySession = () => {
  const [setCustomHistory, setHistoryIndex, setHistoryId, reset] =
    useHistoryStore(
      (state) => [
        state.setCustomHistory,
        state.setHistoryIndex,
        state.setHistoryId,
        state.reset,
      ],
      shallow,
    );

  useEffect(() => {
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

  return null;
};
