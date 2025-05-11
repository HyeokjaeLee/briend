export enum SESSION_STORAGE {
  HISTORY_INDEX = 'custom-history-index',
  HISTORY_EXPIRE = 'custom-history-expire',
  HISTORY = 'custom-history',
  NAVIGATION_ANIMATION = 'session-animation',
  REPLACE_MARK = 'replace-mark',
  REFRESH_TOAST = 'refresh-toast',
  SIDE_PANEL_URL = 'side-panel-url',
  LINKED_PROVIDER = 'linked-provider',
}

export enum LOCAL_STORAGE {}

export type HISTORY_TYPE = [number, string][];
