import { NextRequest } from 'next/server';

export interface MessageReceiveRequestParams {
  id: string;
}

export const POST = async (req: NextRequest) => {
  const message: Message = await req.json();
};

// TODO: 번역이 끝나야 가게 받는 to 를
