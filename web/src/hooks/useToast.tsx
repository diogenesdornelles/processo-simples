/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from 'react-hot-toast';

export function useToast() {
  const success = (message: string, options?: any) => {
    return toast.success(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: '#ffffff',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '8px',
      },
      icon: '✅',
      ...options,
    });
  };

  const error = (message: string, options?: any) => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#EF4444',
        color: '#ffffff',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '8px',
        maxWidth: '400px',
      },
      icon: '❌',
      ...options,
    });
  };

  const loading = (message: string, options?: any) => {
    return toast.loading(message, {
      position: 'top-center',
      style: {
        background: '#3B82F6',
        color: '#ffffff',
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '8px',
      },
      ...options,
    });
  };

  const promise = (
    promise: Promise<any>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: any
  ) => {
    return toast.promise(promise, messages, {
      position: 'top-center',
      style: {
        fontWeight: '500',
        padding: '16px 20px',
        borderRadius: '8px',
      },
      ...options,
    });
  };

  return { success, error, loading, promise };
}
