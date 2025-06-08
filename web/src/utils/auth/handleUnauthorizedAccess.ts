import { useRouter } from 'next/router';
import { manageToken } from './manageToken';

export const useHandleUnauthorizedAccess = () => {
  const router = useRouter();

  return (message?: string) => {
    if (typeof window !== 'undefined') {
      manageToken.cookies.remove();
      localStorage.removeItem('session');
      manageToken.ls.remove();
    }
    console.warn('Unauthorized access:', message);
    router.replace('/login');
  };
};

export const handleUnauthorizedAccess = (message?: string) => {
  if (typeof window !== 'undefined') {
    manageToken.cookies.remove();
    localStorage.removeItem('session');
    manageToken.ls.remove();
    console.warn('Unauthorized access:', message);
    window.location.replace('/login');
  }
};
