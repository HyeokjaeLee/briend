import type { SessionUpdateInput, UserSession } from '@/types/next-auth';

export const updateSession = (
  session: SessionUpdateInput,
): Partial<UserSession> => {
  const { type, data } = session;

  switch (type) {
    case 'unlink-account':
      return {
        [`${data.provider}Id`]: null,
      };

    case 'update-profile':
      return data;
  }
};
