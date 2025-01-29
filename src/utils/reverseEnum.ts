export type ReverseMap<T> = T extends { [P in keyof T]: infer U }
  ? { [P in U & string]: P }
  : never;

export const reverseEnum = <T extends { [key: string]: string }>(
  enumObj: T,
): ReverseMap<T> => {
  const reversed = {} as ReverseMap<T>;

  Object.entries(enumObj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      (reversed as any)[value] = key;
    }
  });

  return reversed;
};
