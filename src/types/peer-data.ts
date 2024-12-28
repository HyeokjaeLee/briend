export enum MESSAGE_TYPE {
  MESSAGE = 'message',
  CHECK_RECEIVE_MESSAGE = 'receive-message',
  UPDATE_PROFILE = 'update-profile',
}

export interface MessageData {
  id: string;
  fromUserId: string;
  message: string;
  translatedMessage: string;
  timestamp: number;
}

interface CheckReceiveMessageData {
  id: string;
  fromUserId: string;
  timestamp: number;
}

export interface UpdateProfile {
  profileImage: {
    blob: Blob;
    type: string;
  };
  token: string;
}

export type PeerData =
  | {
      type: MESSAGE_TYPE.MESSAGE;
      data: MessageData;
    }
  | {
      type: MESSAGE_TYPE.CHECK_RECEIVE_MESSAGE;
      data: CheckReceiveMessageData;
    }
  | {
      type: MESSAGE_TYPE.UPDATE_PROFILE;
      data: UpdateProfile;
    };
