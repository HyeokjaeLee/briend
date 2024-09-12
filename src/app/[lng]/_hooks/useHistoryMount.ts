'use client';

import { useSearchParams } from 'next/navigation';
import { shallow } from 'zustand/shallow';

import { useEffect } from 'react';

import { SESSION } from '@/constants/storage-key';
import { useDeviceStore } from '@/stores/device';

export const useHistoryMount = () => {
  const search = useSearchParams().toString();

  const [setCustomHistory, setHistoryIndex, setLastRouteType, lastRouteType] =
    useDeviceStore(
      (state) => [
        state.setCustomHistory,
        state.setHistoryIndex,
        state.setLastRouteType,
        state.lastRouteType,
      ],
      shallow,
    );

  useEffect(() => {
    const currentHistoryLength = history.length;

    const lastHistoryLength = (() => {
      const lastHistoryLengthSession = sessionStorage.getItem(
        SESSION.HISTORY_LENGTH,
      );

      sessionStorage.setItem(
        SESSION.HISTORY_LENGTH,
        String(currentHistoryLength),
      );

      return lastHistoryLengthSession ? Number(lastHistoryLengthSession) : null;
    })();

    const lastHistoryIndex = (() => {
      const lastHistoryIndexSession = sessionStorage.getItem(
        SESSION.HISTORY_INDEX,
      );

      return lastHistoryIndexSession ? Number(lastHistoryIndexSession) : null;
    })();

    const lastHistorySession = sessionStorage.getItem(SESSION.HISTORY);

    let currentUrl = location.pathname;

    if (search) {
      currentUrl = currentUrl + '?' + search;
    }

    if (
      lastHistoryLength === null ||
      lastHistoryIndex === null ||
      !lastHistorySession
    ) {
      console.info('init history');

      setHistoryIndex(0);

      setLastRouteType('push');

      return setCustomHistory((prev) => {
        prev.clear();
        prev.set(0, currentUrl);
      });
    }

    const hasHistoryIndex = 'index' in history.state;

    setCustomHistory((prev) => {
      if (!lastHistorySession) return;

      if (prev.size || !lastHistoryIndex) return;

      console.info('restore history');

      const lastHistory: [number, string][] = JSON.parse(lastHistorySession);

      lastHistory.forEach(([index, url]) => {
        prev.set(index, url);
      });
    });

    if (hasHistoryIndex) {
      const index: number = history.state.index;

      if (index === lastHistoryIndex) {
        return console.info('re-render');
      }

      setLastRouteType(index < lastHistoryIndex ? 'back' : 'forward');

      setHistoryIndex(index);
    } else {
      const replacedHistoryIndexSession = sessionStorage.getItem(
        SESSION.REPLACED_HISTORY_INDEX,
      );

      if (replacedHistoryIndexSession) {
        setLastRouteType('replace');

        sessionStorage.removeItem(SESSION.REPLACED_HISTORY_INDEX);

        const currentHistoryIndex = Number(replacedHistoryIndexSession);

        setHistoryIndex(currentHistoryIndex);

        setCustomHistory((prev) => {
          prev.set(currentHistoryIndex, currentUrl);
        });
      } else {
        setLastRouteType('push');

        const currentHistoryIndex = lastHistoryIndex + 1;

        setHistoryIndex(currentHistoryIndex);

        setCustomHistory((prev) => {
          for (let i = currentHistoryIndex; i < prev.size; i++) {
            prev.delete(i);
          }

          prev.set(currentHistoryIndex, currentUrl);
        });
      }
    }
  }, [search, setCustomHistory, setHistoryIndex, setLastRouteType]);

  return { lastRouteType };
};
