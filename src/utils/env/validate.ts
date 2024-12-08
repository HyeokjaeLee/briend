import { z } from 'zod';

import { CustomError, ERROR } from '@/utils/customError';

export function validateEnv<T extends z.ZodType>(
  schema: T,
  env: Record<string, unknown>,
  prefix = '',
): z.infer<T> {
  try {
    return schema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const unsetKeys = error.issues.map(
        (issue) => `${prefix}${issue.path.join('.')}`,
      );
      throw new CustomError(ERROR.NOT_ENOUGH_PARAMS(unsetKeys));
    }
    throw error;
  }
}
