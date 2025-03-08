import { realtimeDatabase } from '@/database/firebase/server';
import type { Message } from '@/database/indexed';
import { sendMessageSchema } from '@/schema/trpc/chat';
import { assert, CustomError } from '@/utils';
import { onlyClientRequest } from '@/utils/server';

import { publicProcedure } from '../../settings';

export const sendMessage = publicProcedure
  .input(sendMessageSchema)
  .mutation(async ({ input: { message, receiverId }, ctx }) => {
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

    const now = Date.now();
    const messageData = [now, message];

    // 먼저 메시지 목록을 가져와서 처리
    const msgRef = toUserChattingRef.child('msg');

    // 트랜잭션으로 오래된 메시지 제거 (20개 제한)
    await msgRef.transaction((currentMsgs) => {
      if (currentMsgs === null) {
        // 메시지가 없으면 트랜잭션에서 아무 작업도 하지 않음
        return null;
      }

      // 객체 형태의 메시지 목록을 배열로 변환하여 타임스탬프 기준 정렬
      const msgArray = Object.entries(currentMsgs).map(([key, value]) => ({
        key,
        value,
        timestamp: Array.isArray(value) ? value[0] : 0,
      }));

      // 메시지가 19개 이하면 삭제할 필요 없음 (새 메시지가 추가되어도 20개 이하)
      if (msgArray.length < 20) {
        return currentMsgs;
      }

      // 타임스탬프 오름차순 정렬 (가장 오래된 것이 앞에 오도록)
      msgArray.sort((a, b) => a.timestamp - b.timestamp);

      // 메시지가 20개 이상이면 가장 오래된 것들을 삭제하여 19개로 유지
      // (새 메시지가 추가되면 딱 20개가 됨)

      while (msgArray.length >= 20) {
        const oldest = msgArray.shift();
        if (oldest) {
          delete currentMsgs[oldest.key];
        }
      }

      return currentMsgs;
    });

    // 트랜잭션 이후에 새 메시지 추가 (Firebase가 자동으로 키 생성)
    const ref = await msgRef.push(messageData);
    const id = ref.key;

    assert(id);

    return {
      id,
      timestamp: now,
      translatedMessage: '',
    } satisfies Pick<Message, 'id' | 'timestamp' | 'translatedMessage'>;
  });
