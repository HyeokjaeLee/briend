export const singleton = <T extends (...args: any) => any>(fn: T) => {
  let instance: ReturnType<T>;

  return (...args: Parameters<T>) => {
    if (!instance) instance = fn(...args);

    return instance;
  };
};
