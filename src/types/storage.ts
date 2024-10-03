import type { LANGUAGE } from '@/constants/language';

export namespace LocalStorage {
  export interface CreateChattingInfo {
    friendIndex: number;
    language: LANGUAGE;
  }
}
