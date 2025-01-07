export namespace PusherMessage {
  export interface joinChat {
    channelToken: string;
  }

  export interface addFriend {
    userId: string;
    myToken: string;
    friendToken: string;
  }

  export interface sendMessage {
    id: string;
    fromUserId: string;
    message: string;
    translatedMessage: string;
    timestamp: number;
  }

  export interface receiveMessage {
    id: string;
    userId: string;
  }
}
