export const objectWithoutUndefined = <T extends Record<string, unknown>>(
  obj: T,
): T => {
  const deleteKey = (key: string, obj: Record<string, unknown>) => {
    if (obj[key] === undefined) return delete obj[key];

    if (typeof obj[key] === 'object')
      return deleteKey(key, obj[key] as Record<string, unknown>);
  };

  Object.keys(obj).forEach((key) => {
    deleteKey(key, obj);
  });

  return obj;
};
