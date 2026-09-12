export type ToastType = 'success' | 'error' | 'info';

const TOAST_EVENT = 'portfolio-toast';

export const emitToast = (message: string, type: ToastType = 'success') => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { message, type },
    }),
  );
};
