import { system } from '@/theme';
import { ColorMode } from '@/components/ui/color-mode';

export const modalStyles = (themeColor: ColorMode) => {
  return {
    overlay: {
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    content: {
      position: 'relative' as const,
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      border: 'none',
      background:
        themeColor === 'light'
          ? system.token('colors.purple.200')
          : system.token('colors.purple.800'),
      borderRadius: '12px',
      padding: '0',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
  };
};
