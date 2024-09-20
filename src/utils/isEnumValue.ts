export const isEnumValue = <TEnum extends Record<string, string>>(
  enumType: TEnum,
  value?: string | null,
): value is TEnum[keyof TEnum] =>
  value ? Object.values(enumType).includes(value) : false;
