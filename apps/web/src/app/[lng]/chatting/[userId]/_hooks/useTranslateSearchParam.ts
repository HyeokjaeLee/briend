import { useSearchParams } from 'next/navigation';

import { useCustomRouter, useSidePanel, useThisSidePanel } from '@/hooks';
import { useSidePanelStore } from '@/stores';

const RECEIVER_LANGUAGE_SEARCH_PARAM = 'receiver-language';

export const useTranslateSearchParam = () => {
  const searchParams = useSearchParams();

  const { isSidePanel } = useThisSidePanel();

  const { push } = useSidePanel();

  const router = useCustomRouter();

  const sidePanelUrl = useSidePanelStore((state) => state.sidePanelUrl);

  const isReceiverLanguage = isSidePanel
    ? sidePanelUrl.includes(RECEIVER_LANGUAGE_SEARCH_PARAM)
    : !!searchParams.get(RECEIVER_LANGUAGE_SEARCH_PARAM);

  const handleTranslate = (original: boolean) => {
    if (isSidePanel) {
      const url = new URL(sidePanelUrl, location.origin);

      if (original) {
        url.searchParams.set(RECEIVER_LANGUAGE_SEARCH_PARAM, 'true');
      } else {
        url.searchParams.delete(RECEIVER_LANGUAGE_SEARCH_PARAM);
      }

      return push(url.pathname + url.search);
    }
    const url = new URL(location.href);

    if (original) {
      url.searchParams.set(RECEIVER_LANGUAGE_SEARCH_PARAM, 'true');
    } else {
      url.searchParams.delete(RECEIVER_LANGUAGE_SEARCH_PARAM);
    }

    return router.replace(url.pathname + url.search);
  };

  return { isReceiverLanguage, handleTranslate };
};
