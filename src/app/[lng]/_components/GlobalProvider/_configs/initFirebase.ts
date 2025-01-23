import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

import { IS_CLIENT, PUBLIC_ENV } from '@/constants';

const firebaseConfig = {
  apiKey: PUBLIC_ENV.FIREBASE_API_KEY,
  authDomain: PUBLIC_ENV.FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_ENV.FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_ENV.FIREBASE_APP_ID,
  measurementId: PUBLIC_ENV.FIREBASE_MEASUREMENT_ID,
};

export const initFirebase = () => {
  const app = initializeApp(firebaseConfig);

  if (IS_CLIENT) getAnalytics(app);
};
