export enum SESSION_STORAGE {
  HISTORY_INDEX = 'custom-history-index',
  HISTORY_EXPIRE = 'custom-history-expire',
  HISTORY = 'custom-history',
  REPLACE_MARK = 'replace-mark',
}

export namespace SESSION_STORAGE_TYPE {
  export type HISTORY = [number, string][];
}

export enum LOCAL_STORAGE {
  CREATE_CHATTING_INFO = 'create-chatting-info',
}
