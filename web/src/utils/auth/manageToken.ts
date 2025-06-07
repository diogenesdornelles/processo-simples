export const manageToken = {
  ls: {
    save: (token: string) => {
      localStorage.setItem('token', JSON.stringify({ token }));
    },

    remove: () => {
      localStorage.removeItem('token');
    },

    get: () => {
      const token = localStorage.getItem('token');
      return token ? JSON.parse(token).token : null;
    },
  },
  cookies: {
    save: (token: string) => {
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
    },
    remove: () => {
      document.cookie =
        'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
    },
    get: () => {
      if (typeof window === 'undefined') return null;

      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(cookie =>
        cookie.trim().startsWith('token=')
      );

      return tokenCookie ? tokenCookie.split('=')[1] : null;
    },
  },
};
