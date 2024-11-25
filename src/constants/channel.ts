export const PUSHER_CHANNEL = {
  WAITING: 'private-waiting-channel',
  CHATTING: (hostId: string) => `private-chatting-${hostId}`,
  ONLINE_CHECKING: 'private-online-checking',
  WATTING_INVITE: 'private-waiting-invite',
};

export const PUSHER_EVENT = {
  WAITING: (hostId: string) => `waiting-${hostId}`,
  CHATTING_SEND_MESSAGE: (channelId: string) => `${channelId}-send-message`,
  CHATTING_RECEIVE_MESSAGE: 'chatting-receive-message',
  SUBSCRIPTION_SUCCEEDED: 'pusher:subscription_succeeded',
  MEMBER_ADDED: 'pusher:member_added',
  MEMBER_REMOVED: 'pusher:member_removed',
  // ONLINE_CHECKING
  ASK_ONLINE: (userId: string) => `ask-online-${userId}`,
  REPLY_ONLINE: 'reply-online',
};
