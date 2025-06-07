export const saveTokenOnCookies = (token: string) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
};