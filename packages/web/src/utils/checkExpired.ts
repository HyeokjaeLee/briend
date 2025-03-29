export const checkExpired = (exp?: number) =>
  exp ? exp * 1_000 < Date.now() : true;
