import { LANGUAGE } from '@/constants';

export const typeGuard = {
  isLanguage: (language: string): language is LANGUAGE =>
    Object.values(LANGUAGE).includes(language as LANGUAGE),
};
