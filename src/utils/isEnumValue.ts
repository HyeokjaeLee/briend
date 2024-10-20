export const isEnumValue = <TEnum extends Record<string, string | number>>(
  enumType: TEnum,
  value?: string | number | null,
): value is TEnum[keyof TEnum] =>
  value ? Object.values(enumType).includes(value) : false;
