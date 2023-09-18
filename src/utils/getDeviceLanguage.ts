import { LANGUAGE } from '@/constants';

export const getDeviceLanguage = () => {
  const { language } = navigator;

  switch (language) {
    case 'ko-KR':
      return LANGUAGE.KOREAN;
    case 'ja-JP':
      return LANGUAGE.JAPANESE;
    default:
      return LANGUAGE.ENGLISH;
  }
};
