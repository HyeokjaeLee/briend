import type { NextRequest } from 'next/server';

import type { LANGUAGE } from '@/constants';

export interface ChatPostParams {
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

export interface ChatApiResponse {
  params: {
    token: string;
  };
}

export const POST = async (req: NextRequest, { params }: ChatApiResponse) => {
  try {
    const { meta, message }: ChatPostParams = req.json();
  } catch (e) {
    console.log(e);
  }
};
