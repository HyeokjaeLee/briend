import { CustomError } from './customError';

export function assert(value: unknown): asserts value {
  if (!value) {
    throw new CustomError({
      message: 'Assertion failed',
    });
  }
}
