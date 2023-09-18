export enum LANGUAGE {
  ENGLISH = 'EN',
  JAPANESE = 'JA',
  KOREAN = 'KO',
}

export const LANGUAGE_PACK = {
  PREVENT_MULTI_WINDOW_TITLE: {
    [LANGUAGE.KOREAN]: '한번에 하나의 접속만 가능해요!',
    [LANGUAGE.ENGLISH]: 'Only one connection at a time!',
    [LANGUAGE.JAPANESE]: '一度に一つの接続だけ可能です！',
  },

  PREVENT_MULTI_WINDOW_DESCRIPTION: {
    [LANGUAGE.KOREAN]:
      '다른 창에서 Briend를 사용하고 있다면 그 창을 닫아 주세요.\n다른 창들이 닫혀도 이 메시지가 사라지지 않는다면 새로고침 해 주세요.',
    [LANGUAGE.ENGLISH]:
      'If you are using Briend in another window, please close that window.\nIf this message does not disappear even if other windows are closed, please refresh.',
    [LANGUAGE.JAPANESE]:
      '他のウィンドウでBriendを使用している場合は、そのウィンドウを閉じてください。\n他のウィンドウを閉じてもこのメッセージが消えない場合は、リフレッシュしてください。',
  },

  INVAITE_CHATTING_ROOM_TITLE: {
    [LANGUAGE.KOREAN]: '채팅 초대',
    [LANGUAGE.ENGLISH]: 'Invite to chat',
    [LANGUAGE.JAPANESE]: 'チャット招待',
  },

  INVITE_CHATTING_ROOM_DESCRIPTION: {
    [LANGUAGE.KOREAN]:
      'QR을 스캔하면 설치 없이 한국어로 저와 대화할 수 있어요.',
    [LANGUAGE.ENGLISH]:
      'Scan the QR and you can talk to me in English without installation.',
    [LANGUAGE.JAPANESE]:
      'QRをスキャンすると、インストールなしで日本語で私と会話ができます。',
  },

  INVITE_CHATTING_ROOM_TIME_LIMIT: {
    [LANGUAGE.KOREAN]: '이 채팅은 제한 시간동안만 유지되요.',
    [LANGUAGE.ENGLISH]: 'This chat will only last for a limited time.',
    [LANGUAGE.JAPANESE]: 'このチャットは制限時間内のみ維持されます。',
  },

  JOIN_EXPIRED_CHATTING_ROOM_TOAST: {
    [LANGUAGE.KOREAN]: (opponentName: string) =>
      `이 채팅방은 만료되었어요.\n${opponentName}님에게 새로운 링크를 요청해주세요!`,
    [LANGUAGE.ENGLISH]: (opponentName: string) =>
      `This chat has expired.\nPlease request a new link to ${opponentName}!`,
    [LANGUAGE.JAPANESE]: (opponentName: string) =>
      `このチャットは期限切れです。\n${opponentName}に新しいリンクを要求してください！`,
  },

  JOIN_NEW_CHATTING_ROOM_TOAST: {
    [LANGUAGE.KOREAN]: (opponentName: string) =>
      `${opponentName}님과 대화를 시작해보세요!\n한국어로 말하면 번역해드려요!`,
    [LANGUAGE.ENGLISH]: (opponentName: string) =>
      `Start chatting with ${opponentName}!\nChat English and I'll translate it!`,
    [LANGUAGE.JAPANESE]: (opponentName: string) =>
      `${opponentName}とチャットを始めましょう！\n日本語で話して、私が翻訳します！`,
  },
};
