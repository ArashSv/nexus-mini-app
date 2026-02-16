import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { ThemeToggle } from '@/components/ThemeToggle';
export function MobileLayout() {
  return (
    <div className="relative min-h-screen w-full bg-[#0F172A] text-white overflow-x-hidden font-sans">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>
      <TopHeader />
      <ThemeToggle className="fixed top-20 right-4" />
      <main className="relative z-10 w-full max-w-md mx-auto pt-24 pb-32 px-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}