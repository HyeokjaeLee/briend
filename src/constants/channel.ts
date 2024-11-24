export const PUSHER_CHANNEL = {
  WAITING: 'presence-waiting-channel',
  CHATTING: (hostId: string) => `presence-chatting-${hostId}`,
  ONLINE_CHECKING: 'online-checking-channel',
  WATTING_INVITE: 'waiting-invite-channel',
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
  // WATTING_INVITE
  WAITING_INVITE: (inviteToken: string) => `waiting-invite-${inviteToken}`,
};
