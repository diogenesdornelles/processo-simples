// filepath: /home/dio/programacao/processo-facil/web/src/utils/auth/manageToken.ts
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const TOKEN_KEY = process.env.NEXT_PUBLIC_AUTH_TOKEN || 'default_auth_token';

export const manageToken = {
  ls: {
    save: (token: string) => {
      localStorage.setItem(TOKEN_KEY, JSON.stringify({ token }));
    },

    remove: () => {
      localStorage.removeItem(TOKEN_KEY);
    },

    get: () => {
      const storedValue = localStorage.getItem(TOKEN_KEY);
      return storedValue ? JSON.parse(storedValue).token : null;
    },
  },
  cookies: {
    save: (token: string) => {
      setCookie(TOKEN_KEY, token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    },
    remove: () => {
      deleteCookie(TOKEN_KEY, {
        path: '/',
      });
    },
    get: () => {
      return getCookie(TOKEN_KEY) || null;
    },
  },
  get: () => {
    const cookieToken = manageToken.cookies.get();
    if (cookieToken) {
      return cookieToken;
    }
    if (typeof window !== 'undefined') {
      return manageToken.ls.get();
    }
    return null;
  },
  set: (token: string) => {
    manageToken.cookies.save(token);
    if (typeof window !== 'undefined') {
      manageToken.ls.save(token);
    }
  },
  remove: () => {
    manageToken.cookies.remove();
    if (typeof window !== 'undefined') {
      manageToken.ls.remove();
    }
  },
};
