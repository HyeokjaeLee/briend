import type { ApiRouter } from '@/routes/server';
import type { inferReactQueryProcedureOptions } from '@trpc/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export type ReactQueryOptions = inferReactQueryProcedureOptions<ApiRouter>;
export type RouterInputs = inferRouterInputs<ApiRouter>;
export type RouterOutputs = inferRouterOutputs<ApiRouter>;
