export const isArrayItem = <T>(array: readonly T[], value: any): value is T =>
  array.includes(value);
