import type { ApiRouter } from '@/routes/server';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<ApiRouter>();
