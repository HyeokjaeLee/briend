export const hashCode = (str: string) => {
  let hash = 0;
  let i;
  let chr;
  const stringLength = str.length;

  if (stringLength === 0) return hash;

  for (i = 0; i < stringLength; i += 1) {
    chr = str.charCodeAt(i);
    hash = Math.imul(hash, 31) + chr;
    hash = hash > Number.MAX_SAFE_INTEGER ? 0 : hash;
  }
  return hash;
};
