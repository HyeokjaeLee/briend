import { useChattingListener } from './_hooks/useChattingListener';
import { useHistoryListener } from './_hooks/useHistoryListener';
import { useScrollListener } from './_hooks/useScrollListener';
import { useViewportListener } from './_hooks/useViewportListener';

export const GlobalListener = () => {
  useChattingListener();
  useHistoryListener();
  useViewportListener();
  useScrollListener();

  return <></>;
};
