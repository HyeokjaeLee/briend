export enum SESSION_STORAGE {
  HISTORY_ID = 'history-id',
  HISTORY = 'history',
  HISTORY_INDEX = 'history-index',
  HISTORY_LENGTH = 'history-length',
  REPLACED_MARK = 'replaced-mark',
  /**
   * @description Root 페이지들로 이동할 때 사용할 수 있는 애니메이션 정보
   * @example 'left' | 'right'
   */
  ROOT_NAV_ANIMATION = 'root-nav-animation',
  LOGOUT_MARK = 'logout-mark',
}

export enum LOCAL_STORAGE {
  CREATE_CHATTING_INFO = 'create-chatting-info',
  MY_NICKNAME = 'my-nickname',
  MY_PROFILE_EMOJI = 'my-profile-emoji',
}
