import { customAlphabet } from 'nanoid';

export const createId = (length = 21) => {
  const timestamp = Date.now().toString(36);

  const customNanoId = customAlphabet(
    '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    length - timestamp.length,
  );

  return timestamp + customNanoId();
};
