// filepath: /home/dio/programacao/processo-facil/web/src/utils/auth/manageToken.ts
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN || 'default_auth_token';

export const manageToken = {
  save: async (token: string) => {
    await setCookie(TOKEN_KEY, token, {
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  },
  remove: async () => {
    await deleteCookie(TOKEN_KEY, {
      path: '/',
    });
  },
  get: async () => {
    return (await getCookie(TOKEN_KEY)) || null;
  },
};
