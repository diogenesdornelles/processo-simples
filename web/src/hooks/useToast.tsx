/* eslint-disable @typescript-eslint/no-explicit-any */
import { toaster } from '@/components/ui/toaster';

export function useToast() {
  const show = (
    title: string,
    message: string,
    status: 'success' | 'error' | 'info' | 'warning' | 'loading' = 'success',
    label?: string,
    cb?: () => void
  ) => {
    return toaster[status]({
      title,
      description: message,
      duration: 3000,
      action: {
        label: label || 'OK',
        onClick: () => {
          if (cb) cb();
        },
      },
    });
  };

  const dismiss = () => {
    return toaster.dismiss();
  };

  const promise = (
    promise: Promise<any>,
    error: {
      title: string;
      description: string;
    },
    success: {
      title: string;
      description: string;
    },
    loading: {
      title: string;
      description: string;
    }
  ) => {
    toaster.promise(promise, {
      success: {
        title: success.title,
        description: success.description,
      },
      error: {
        title: error.title,
        description: error.description,
      },
      loading: {
        title: loading.title,
        description: loading.description,
      },
    });
  };

  return { show, promise, dismiss };
}
