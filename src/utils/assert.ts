import { CustomError } from './customError';

export function assert<U>(value: U[]): asserts value is NonNullable<U>[];
export function assert<T>(value: T): asserts value is NonNullable<T>;
export function assert(value: unknown): asserts value {
  if (Array.isArray(value)) {
    const emptyValueList: number[] = [];
    value.forEach((item, index) => {
      if (!item) {
        emptyValueList.push(index);
      }
    });

    if (emptyValueList.length)
      throw new CustomError({
        message: `Assertion failed: index ${emptyValueList.join(', ')} is empty`,
      });
  } else if (!value) {
    throw new CustomError({
      message: 'Assertion failed',
    });
  }
}
