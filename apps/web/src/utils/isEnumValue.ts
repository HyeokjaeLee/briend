export const isEnumValue = <TEnum extends Record<string, string | number>>(
  enumType: TEnum,
  value?: string | number | null | unknown,
): value is TEnum[keyof TEnum] =>
  value
    ? (typeof value === 'string' || typeof value === 'number') &&
      Object.values(enumType).includes(value)
    : false;
