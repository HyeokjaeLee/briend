export enum MESSAGE_TYPE {
  MESSAGE = 'message',
  CHECK_RECEIVE_MESSAGE = 'receive-message',
  UPDATE_PROFILE = 'update-profile',
}

interface Message {
  id: string;
  fromUserId: string;
  message: string;
  translatedMessage: string;
  timestamp: number;
}

interface CheckReceiveMessage {
  id: string;
  fromUserId: string;
  timestamp: number;
}

interface UpdateProfile {
  profileImage: {
    blob: Blob;
    type: string;
  };
  token: string;
}

export type PeerData =
  | {
      type: MESSAGE_TYPE.MESSAGE;
      data: Message;
    }
  | {
      type: MESSAGE_TYPE.CHECK_RECEIVE_MESSAGE;
      data: CheckReceiveMessage;
    }
  | {
      type: MESSAGE_TYPE.UPDATE_PROFILE;
      data: UpdateProfile;
    };
