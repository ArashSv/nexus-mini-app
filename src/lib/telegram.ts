export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    return (window as any).Telegram.WebApp;
  }
  return null;
};
export const hapticFeedback = {
  impact: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') => {
    const tg = getTelegramWebApp();
    tg?.HapticFeedback?.impactOccurred(style);
  },
  notification: (type: 'error' | 'success' | 'warning') => {
    const tg = getTelegramWebApp();
    tg?.HapticFeedback?.notificationOccurred(type);
  },
  selection: () => {
    const tg = getTelegramWebApp();
    tg?.HapticFeedback?.selectionChanged();
  }
};
export const getInitData = () => {
  const tg = getTelegramWebApp();
  return tg?.initData || '';
};
export const closeWebApp = () => {
  getTelegramWebApp()?.close();
};
export const expandWebApp = () => {
  getTelegramWebApp()?.expand();
};