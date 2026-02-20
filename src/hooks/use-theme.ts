import { useState, useEffect, useCallback } from 'react';
import { getTelegramWebApp } from '@/lib/telegram';
function getInitialTheme(): boolean {
  if (typeof window === 'undefined') return true;
  const tg = getTelegramWebApp();
  if (tg?.colorScheme) {
    return tg.colorScheme === 'dark';
  }
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme === 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  useEffect(() => {
    const tg = getTelegramWebApp();
    if (!tg) return;
    const handleThemeChange = () => {
      setIsDark(tg.colorScheme === 'dark');
    };
    tg.onEvent('themeChanged', handleThemeChange);
    return () => tg.offEvent('themeChanged', handleThemeChange);
  }, []);
  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);
  return { isDark, toggleTheme };
}