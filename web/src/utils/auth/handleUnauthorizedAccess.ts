import { useRouter } from 'next/router';
import { manageToken } from './manageToken';

export const useHandleUnauthorizedAccess = () => {
  const router = useRouter();

  return async (message?: string) => {
    if (typeof window !== 'undefined') {
      await manageToken.remove();
      localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_SESSION || '');
    }
    console.warn('Unauthorized access:', message);
    router.replace('/login');
  };
};

export const handleUnauthorizedAccess = async (message?: string) => {
  if (typeof window !== 'undefined') {
    await manageToken.remove();
    localStorage.removeItem(process.env.NEXT_PUBLIC_AUTH_SESSION || '');
    console.warn('Unauthorized access:', message);
    window.location.replace('/login');
  }
};
