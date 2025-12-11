import { useState } from 'react';

export const useToast = () => {
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setNotification({ type, message });
  };

  const hideToast = () => {
    setNotification(null);
  };

  return { notification, showToast, hideToast };
};