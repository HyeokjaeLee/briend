import { apiRouter } from '@/routes/server';

import { createContext, createCaller } from './settings';

const ctx = await createContext(null);

export const trpc = createCaller(apiRouter)(ctx);

export const runtime = 'nodejs';
