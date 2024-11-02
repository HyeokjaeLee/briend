export const createQueryKeys = <TName extends string, TKeys extends string[]>(
  name: TName,
  keys: TKeys,
) => {
  const result = {} as Record<TKeys[number], `${TName}.${TKeys[number]}`>;

  for (const key in keys) {
    const k = key as TKeys[number];
    result[k] = `${name}.${k}`;
  }

  return result;
};
