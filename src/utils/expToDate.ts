export const expToDate = (exp?: number) =>
  exp ? new Date(exp * 1_000) : new Date();
