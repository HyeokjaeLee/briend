export const parseCookie = (cookies: string) =>
  new Map(
    cookies.split('; ').map((cookie) => {
      const [key, value] = cookie.split('=');

      return [key, value];
    }),
  );
