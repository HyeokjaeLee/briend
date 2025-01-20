import type { LOGIN_PROVIDERS } from '@/constants';

export namespace ApiResponse {
  export interface CREATE_FRIEND {
    friendUserId: string;
    myToken: string;
    friendToken: string;
  }

  export interface UNLINK_ACCOUNT {
    unlinkedProvider: LOGIN_PROVIDERS;
  }

  export interface EDIT_PROFILE {
    nickname: string;
  }

  export interface RECEIVE_MESSAGE {
    id: string;
  }
}
