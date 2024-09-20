export const hasObjectKey = <TValue, TKey extends string>(
  obj: Record<any, TValue> | object | unknown,
  key: TKey,
): obj is Record<TKey, TValue> => {
  return typeof obj === 'object' && obj !== null && key in obj;
};
