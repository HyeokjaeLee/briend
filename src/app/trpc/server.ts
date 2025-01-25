import { apiRouter } from '@/routes/server';

import { createContext, createCaller } from './settings';

const ctx = await createContext();

export const trpc = createCaller(apiRouter)(ctx);
