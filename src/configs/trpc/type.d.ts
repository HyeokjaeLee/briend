import type { inferReactQueryProcedureOptions } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import type { ApiRouter } from '@/routes/server';

export type ReactQueryOptions = inferReactQueryProcedureOptions<ApiRouter>;
export type RouterInputs = inferRouterInputs<ApiRouter>;
export type RouterOutputs = inferRouterOutputs<ApiRouter>;
