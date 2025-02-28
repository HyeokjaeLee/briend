import type { LOGIN_PROVIDERS } from '@/constants';

export interface CREATE_FRIEND {
  guestId: string;
  inviteToken: string;
}

export interface UNLINK_ACCOUNT {
  provider: LOGIN_PROVIDERS;
}

export interface EDIT_PROFILE {
  nickname: string;
}

export interface SEND_MESSAGE {
  channelToken: string;
  message: string;
  fromUserId: string;
  id: string;
}

export interface RECEIVE_MESSAGE {
  id: string;
  channelToken: string;
  message: string;
}

export interface AUTHENTICATE_PUSHER {
  socketId: string;
  userId: string;
}

export interface SyncUserData {
  syncUserToken: string;
}

export interface LinkAccount {
  linkBaseAccountToken: string;
  linkNewAccountToken: string;
}
