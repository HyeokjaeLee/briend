export const PUSHER_CHANNEL = {
  WAITING: 'presence-waiting-channel',
  CHATTING: (hostId: string) => `presence-chatting-${hostId}`,
};

export const PUSHER_EVENT = {
  WAITING: (hostId: string) => `waiting-${hostId}`,
  CHATTING_SEND_MESSAGE: (channelId: string) => `${channelId}-send-message`,
  CHATTING_RECEIVE_MESSAGE: 'chatting-receive-message',
  SUBSCRIPTION_SUCCEEDED: 'pusher:subscription_succeeded',
  MEMBER_ADDED: 'pusher:member_added',
  MEMBER_REMOVED: 'pusher:member_removed',
};
