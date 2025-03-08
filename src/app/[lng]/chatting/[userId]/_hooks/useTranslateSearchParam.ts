import { useSearchParams } from 'next/navigation';

import { useCustomRouter, useSidePanel } from '@/hooks';
import { useSidePanelStore } from '@/stores';

interface TranslateSearchParamProps {
  sidePanel?: boolean;
}

const ORIGINAL_SEARCH_PARAM = 'original';

export const useTranslateSearchParam = ({
  sidePanel,
}: TranslateSearchParamProps) => {
  const searchParams = useSearchParams();

  const { push } = useSidePanel();

  const router = useCustomRouter();

  const sidePanelUrl = useSidePanelStore((state) => state.sidePanelUrl);

  const isOriginal = sidePanel
    ? sidePanelUrl.includes(ORIGINAL_SEARCH_PARAM)
    : !!searchParams.get(ORIGINAL_SEARCH_PARAM);

  const handleTranslate = (original: boolean) => {
    if (sidePanel) {
      const url = new URL(sidePanelUrl, location.origin);

      if (original) {
        url.searchParams.set(ORIGINAL_SEARCH_PARAM, 'true');
      } else {
        url.searchParams.delete(ORIGINAL_SEARCH_PARAM);
      }

      return push(url.pathname + url.search);
    }
    const url = new URL(location.href);

    if (original) {
      url.searchParams.set(ORIGINAL_SEARCH_PARAM, 'true');
    } else {
      url.searchParams.delete(ORIGINAL_SEARCH_PARAM);
    }

    return router.replace(url.pathname + url.search);
  };

  return { isOriginal, handleTranslate };
};
