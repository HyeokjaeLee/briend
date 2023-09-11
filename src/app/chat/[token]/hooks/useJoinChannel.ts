import axios from 'axios';

import { useEffect } from 'react';

import { CHANNEL_EVENT, LANGUAGE } from '@/constants';
import { useChattingRoomStore } from '@/store/useChattingRoomStore';
import { useToast } from '@hyeokjaelee/pastime-ui';

import { JoinPostParams, JoinPusherResponse } from '../api/join/route';

export const useJoinChannel = () => {
  const chattingRoomInfo = useChattingRoomStore((state) => state.info);
  const { toast } = useToast();

  useEffect(() => {
    if (chattingRoomInfo) {
      const { token, isHost, userLanguage, opponentName, channel } =
        chattingRoomInfo;

      (async () => {
        const { status } = await axios.post(`${token}/api/join`, {
          isHost,
        } satisfies JoinPostParams);

        if (!isHost) {
          switch (status) {
            case 401: {
              return toast({
                // TODO: Toast type 추론 개선
                message: {
                  [LANGUAGE.KOREAN]: `이 채팅방은 만료되었어요.\n\n${opponentName}님에게 새로운 링크를 요청해주세요!`,
                  // TODO: 번역 필요 Toast pre line으로 변경 필요
                  [LANGUAGE.ENGLISH]: `이 채팅방은 만료되었어요.\n\n${opponentName}님에게 새로운 링크를 요청해주세요!`,
                  [LANGUAGE.JAPANESE]: `이 채팅방은 만료되었어요.\n\n${opponentName}님에게 새로운 링크를 요청해주세요!`,
                }[userLanguage],
              });
            }
          }
        }
      })();

      let isFirstShow = true;

      channel.bind(CHANNEL_EVENT.JOIN_CHANNEL, (data: JoinPusherResponse) => {
        if (data.isHost !== isHost) {
          // TODO: 언어별 대응 필요

          if (isFirstShow) {
            toast({
              message: {
                [LANGUAGE.KOREAN]: `${opponentName}님과 대화를 시작해보세요!\n\n일본어로 말하면 번역해드려요!`,
                // TODO: 번역 필요 Toast pre line으로 변경 필요
                [LANGUAGE.ENGLISH]: `${opponentName}님과 대화를 시작해보세요!\n\n일본어로 말하면 번역해드려요!`,
                [LANGUAGE.JAPANESE]: `${opponentName}님과 대화를 시작해보세요!\n\n일본어로 말하면 번역해드려요!`,
              }[userLanguage],
            });
            isFirstShow = false;
          } else {
            toast({
              message: `${opponentName}님이 채팅을 보고 있어요!`,
            });
          }
        }
      });
    }
  }, [chattingRoomInfo, toast]);
};
