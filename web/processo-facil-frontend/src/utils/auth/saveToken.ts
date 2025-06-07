export const saveToken = (token: string) => {
  // Configuração segura do cookie
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7 dias

  document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
};

export const removeToken = () => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};