export const PUSHER_CHANNEL = {
  WAITING: 'waiting-channel',
  CHATTING: (hostId: string, channelId: string) =>
    `chatting-${hostId}-${channelId}`,
};

export const PUSHER_EVENT = {
  WAITING: (hostId: string) => `waiting-${hostId}`,
  CHATTING_SEND_MESSAGE: (toUserId: string) => `send-message-${toUserId}`,
  CHATTING_RECEIVE_MESSAGE: 'chatting-receive-message',
};
