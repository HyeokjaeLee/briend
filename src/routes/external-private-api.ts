import ky from 'ky';

import { PRIVATE_ENV } from '@/constants/private-env';
import { IS_DEV } from '@/constants/public-env';

export const EXTERNAL_PRIVATE_API = {
  SHORT_URL: async (url: string) => {
    if (IS_DEV) return url;

    try {
      const params = new URLSearchParams({
        customer_id: '67439768',
        partner_api_id: PRIVATE_ENV.BULY_API_KEY,
        org_url: url,
      });

      const res = await ky.post<{
        result: string;
        message: string;
        url: string;
      }>('http://www.buly.kr/api/shoturl.siso', {
        body: params.toString(),
      });

      const json = await res.json();

      if (json.result !== 'Y') return url;

      return json.url;
    } catch {
      return url;
    }
  },
};
