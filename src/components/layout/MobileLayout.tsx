import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { backButton, hapticFeedback } from '@/lib/telegram';
export function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === '/') {
      backButton.hide();
    } else {
      backButton.show(() => {
        hapticFeedback.impact('light');
        navigate(-1);
      });
    }
  }, [location.pathname, navigate]);
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-x-hidden font-sans">
      {/* Background decoration with Safe Area aware positioning */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[var(--sat)] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[var(--sab)] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>
      <TopHeader />
      <ThemeToggle className="fixed top-[calc(5rem+var(--sat))] right-4" />
      {/* Main content with safe area spacing */}
      <main className="relative z-10 w-full max-w-md mx-auto pt-[calc(5rem+var(--sat))] pb-[calc(6rem+var(--sab))] px-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}