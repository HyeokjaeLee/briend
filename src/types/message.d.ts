import type { LANGUAGE } from '@/constants';

export interface Message {
  meta: {
    from: string;
    to: string;
    createdAt: Date;
  };
  message: {
    [LANGUAGE.KOREAN]?: string;
    [LANGUAGE.ENGLISH]?: string;
    [LANGUAGE.JAPANESE]?: string;
  };
}
