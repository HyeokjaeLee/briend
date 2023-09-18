export enum LANGUAGE {
  ENGLISH = 'EN',
  JAPANESE = 'JA',
  KOREAN = 'KO',
}

export const LANGUAGE_PACK = {
  PREVENT_MULTI_WINDOW_TITLE: {
    [LANGUAGE.KOREAN]: '한번에 하나의 접속만 가능해요!',
  },
  PREVENT_MULTI_WINDOW_DESCRIPTION: {
    [LANGUAGE.KOREAN]:
      '다른 창에서 Briend를 사용하고 있다면 그 창을 닫아 주세요.\n다른 창들이 닫혀도 이 메시지가 사라지지 않는다면 새로고침 해 주세요.',
  },
};
