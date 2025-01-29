import { apiRouter } from '@/routes/server';

import { createContext, createCaller } from './settings';

//TODO: 실제 컨텍스트 넘겨도 될듯, 그리고 서버가 아니라 그냥 trpc와 useTrpc로 분리해야할듯..
const ctx = await createContext(null);

export const trpc = createCaller(apiRouter)(ctx);
