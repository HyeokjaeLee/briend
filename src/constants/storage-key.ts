export enum SESSION_STORAGE {
  HISTORY_INDEX = 'custom-history-index',
  HISTORY_EXPIRE = 'custom-history-expire',
  HISTORY = 'custom-history',
  NAVIGATION_ANIMATION = 'session-animation',
  REPLACE_MARK = 'replace-mark',
  REFRESH_TOAST = 'refresh-toast',
  ONLY_INTERCEPT = 'only-intercept',
}

export namespace SESSION_STORAGE_TYPE {
  export type HISTORY = [number, string][];
  export type NAVIGATION_ANIMATION =
    | 'FROM_LEFT'
    | 'FROM_RIGHT'
    | 'FROM_TOP'
    | 'FROM_BOTTOM'
    | 'NONE';
}

export enum LOCAL_STORAGE {
  LAST_INVITE_LANGUAGE = 'last-invite-language',
}

export namespace LOCAL_STORAGE_TYPE {}
