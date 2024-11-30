'use client';

import { create } from 'zustand';

import { IS_CLIENT } from '@/constants/etc';
import type { SESSION_STORAGE_TYPE } from '@/constants/storage-key';
import { SESSION_STORAGE } from '@/constants/storage-key';
import { CustomError } from '@/utils/customError';

interface HistoryStore {
  historyIndex: number;
  setHistoryIndex: (historyIndex: number) => void;

  customHistory: Map<number, string>;
  setCustomHistory: (customHistory: Map<number, string>) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => {
  let historyIndex = -1;
  const customHistory = new Map<number, string>();

  if (IS_CLIENT) {
    const sessionExpire = sessionStorage.getItem(
      SESSION_STORAGE.HISTORY_EXPIRE,
    );

    try {
      if (sessionExpire ? Number(sessionExpire) < Date.now() : true)
        throw new CustomError();

      const sessionHistory = sessionStorage.getItem(SESSION_STORAGE.HISTORY);
      const sessionHistoryIndex = sessionStorage.getItem(
        SESSION_STORAGE.HISTORY_INDEX,
      );

      if (!sessionHistory || !sessionHistoryIndex) throw new CustomError();

      historyIndex = Number(sessionHistoryIndex);

      const history: SESSION_STORAGE_TYPE.HISTORY = JSON.parse(sessionHistory);

      history.forEach(([index, path]) => {
        customHistory.set(index, path);
      });
    } catch {
      customHistory.clear();
    } finally {
      sessionStorage.removeItem(SESSION_STORAGE.HISTORY_EXPIRE);
      sessionStorage.removeItem(SESSION_STORAGE.HISTORY);
      sessionStorage.removeItem(SESSION_STORAGE.HISTORY_INDEX);
    }
  }

  return {
    historyIndex,
    customHistory,
    setHistoryIndex: (historyIndex) => {
      sessionStorage.setItem(
        SESSION_STORAGE.HISTORY_INDEX,
        historyIndex.toString(),
      );

      return set({
        historyIndex,
      });
    },
    setCustomHistory: (customHistory) => {
      sessionStorage.setItem(
        SESSION_STORAGE.HISTORY,
        JSON.stringify(Array.from(customHistory.entries())),
      );

      return set({ customHistory });
    },
  };
});
