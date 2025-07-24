// Common utility functions
export const createId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toISOString();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};