export enum MESSAGE_TYPE {
  MESSAGE = 'message',
  CHECK_RECEIVE_MESSAGE = 'receive-message',
  REQUEST_PROFILE = 'request-profile',
  UPDATE_PROFILE = 'update-profile',
  CHECK_PEER_STATUS = 'check-peer-status',
}

export interface MessageData {
  fromUserId: string;
  message: string;
  translatedMessage: string;
  timestamp: number;
}

interface CheckReceiveMessageData {
  fromUserId: string;
  timestamp: number;
}

interface RequestProfile {
  fromUserId: string;
}

export interface UpdateProfile {
  profileImage: {
    blob: Blob;
    type: string;
  };
  token: string;
}

type PeerDataMap = {
  [MESSAGE_TYPE.MESSAGE]: MessageData;
  [MESSAGE_TYPE.CHECK_RECEIVE_MESSAGE]: CheckReceiveMessageData;
  [MESSAGE_TYPE.REQUEST_PROFILE]: RequestProfile;
  [MESSAGE_TYPE.UPDATE_PROFILE]: UpdateProfile;
  [MESSAGE_TYPE.CHECK_PEER_STATUS]: string;
};

export type PeerData = {
  [T in MESSAGE_TYPE]: {
    id: string;
    type: T;
    data: PeerDataMap[T];
  };
}[MESSAGE_TYPE];
