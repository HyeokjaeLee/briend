import type { LOGIN_PROVIDERS } from './etc';

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

export namespace SESSION_STORAGE_TYPE {
  export type HISTORY = [number, string][];
  export type NAVIGATION_ANIMATION =
    | 'FROM_LEFT'
    | 'FROM_RIGHT'
    | 'FROM_TOP'
    | 'FROM_BOTTOM'
    | 'NONE';
  export type LINKED_PROVIDER = LOGIN_PROVIDERS;
}

export enum LOCAL_STORAGE {}

export namespace LOCAL_STORAGE_TYPE {}
