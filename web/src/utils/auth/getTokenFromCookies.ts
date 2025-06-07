export const getTokenFromCookies = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};