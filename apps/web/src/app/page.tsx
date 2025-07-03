import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/configs/auth';
import { fallbackLng } from '@/configs/i18n/settings';
import { COOKIES, LANGUAGE } from '@/constants';
import { ROUTES } from '@/routes/client';
import { isEnumValue } from '@/utils';

export default async function HomePage() {
  // 사용자 언어 감지를 위한 정보 수집
  const session = await auth();
  const headersList = await headers();
  const cookieStore = await cookies();
  
  // 언어 우선순위: 사용자 설정 > i18n 쿠키 > Accept-Language > fallback
  const userLanguage = session?.user?.language;
  const i18nCookie = cookieStore.get(COOKIES.I18N)?.value;
  const acceptLanguage = headersList.get('Accept-Language')?.split(',')[0];
  
  let lng = userLanguage || i18nCookie || acceptLanguage;
  
  // 유효한 언어가 아니면 fallback 언어 사용
  if (!isEnumValue(LANGUAGE, lng)) {
    lng = fallbackLng;
  }
  
  // SEO를 위해 언어 경로가 포함된 URL로 리다이렉트
  redirect(`/${lng}${ROUTES.FRIEND_LIST.pathname}`);
}