import { publicProcedure } from '@/configs/trpc/settings';
import { LANGUAGE } from '@/constants';
import { realtimeDatabase } from '@/database/firebase/server';
import type { Message } from '@/database/indexed';
import { sendMessageSchema } from '@/schema/trpc/chat';
import { assertEnum, CustomError } from '@/utils';
import { onlyClientRequest } from '@/utils/server';
import { translate } from '@/utils/server/node';

export const sendMessage = publicProcedure
  .input(sendMessageSchema)
  .mutation(
    async ({ input: { message, receiverId, receiverLanguage }, ctx }) => {
      onlyClientRequest(ctx);

      const senderId = ctx.firebaseSession.uid;

      const myInviteId = await realtimeDatabase
        .ref(`${senderId}/chat/${receiverId}/inviteId`)
        .get();

      const toUserChattingRef = realtimeDatabase.ref(
        `${receiverId}/chat/${senderId}`,
      );

      const toUserInviteId = await toUserChattingRef.child('inviteId').get();

      if (
        !myInviteId.exists ||
        !toUserInviteId.exists ||
        myInviteId.val() !== toUserInviteId.val()
      )
        throw new CustomError({ code: 'UNAUTHORIZED' });

      const senderLanguage =
        ctx.session?.user.language ??
        (await toUserChattingRef.child('inviteeLanguage').get()).val();

      assertEnum(LANGUAGE, senderLanguage);

      const translatedMessage =
        receiverLanguage === senderLanguage
          ? ''
          : await translate({
              message,
              sourceLanguage: senderLanguage,
              targetLanguage: receiverLanguage,
            });

      const now = Date.now();
      const messageData = [now, message, translatedMessage];

      // 메시지 참조 설정
      const msgRef = toUserChattingRef.child('msg');

      // 1. 먼저 메시지 갯수만 확인
      const msgSnapshot = await msgRef.once('value');
      const messages = msgSnapshot.val() || {};
      const messageCount = Object.keys(messages).length;

      // 2. 메시지가 20개 이상이면 가장 오래된 메시지 하나만 삭제
      if (20 <= messageCount) {
        // 가장 먼저 추가된(가장 오래된) 메시지의 키를 찾음

        // Firebase 푸시 ID는 시간순으로 정렬되므로 단순히 알파벳 순 정렬해도 됨
        const keys = Object.keys(messages);
        if (keys.length > 0) {
          const oldestKey = keys.sort()[0];

          if (oldestKey) {
            await msgRef.child(oldestKey).remove();
          }
        }
      }

      // 3. 새 메시지 추가
      const ref = await msgRef.push(messageData);
      const id = ref.key;

      // null 체크
      if (!id) {
        throw new Error('Failed to generate message ID');
      }

      return {
        id,
        timestamp: now,
        translatedMessage,
      } satisfies Pick<Message, 'id' | 'timestamp' | 'translatedMessage'>;
    },
  );
