import { useEffect, useState } from 'react';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const ToastContainer = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastMessage>;
      setToast(customEvent.detail);
    };

    window.addEventListener('portfolio-toast', handleToast);

    return () => {
      window.removeEventListener('portfolio-toast', handleToast);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    error: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-blue-200 bg-blue-50 text-blue-700',
  };

  return (
    <div className="fixed right-4 top-4 z-60">
      <div
        className={`rounded-xl border px-4 py-3 text-sm font-medium shadow-lg ${styles[toast.type]}`}
      >
        {toast.message}
      </div>
    </div>
  );
};
