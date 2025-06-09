/* eslint-disable @typescript-eslint/no-explicit-any */
import { toaster } from '@/components/ui/toaster';

export function useToast() {
  const success = (
    title: string,
    message: string,
    label?: string,
    cb?: () => void
  ) => {
    return toaster.success({
      title: title,
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

  const error = (
    title: string,
    message: string,
    label?: string,
    cb?: () => void
  ) => {
    return toaster.error({
      title: title,
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

  const loading = (
    title: string,
    message: string,
    label?: string,
    cb?: () => void
  ) => {
    toaster.loading({
      title: title,
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

  const info = (
    title: string,
    message: string,
    label?: string,
    cb?: () => void
  ) => {
    toaster.info({
      title: title,
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

  return { success, error, loading, promise, info, dismiss };
}
