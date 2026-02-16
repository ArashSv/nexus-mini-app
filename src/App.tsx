import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { TasksPage } from '@/pages/TasksPage';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api-client';
import { Toaster } from '@/components/ui/sonner';
import { getTelegramWebApp } from '@/lib/telegram';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      { index: true, element: <TasksPage /> },
      { path: 'wallet', element: <div className="p-4 text-center">Wallet Coming Soon</div> },
      { path: 'referral', element: <div className="p-4 text-center">Referral Coming Soon</div> },
      { path: 'more', element: <div className="p-4 text-center">Settings Coming Soon</div> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
]);
export default function App() {
  const setUser = useAppStore((s) => s.setUser);
  const setLoaded = useAppStore((s) => s.setLoaded);
  useEffect(() => {
    const initApp = async () => {
      const tg = getTelegramWebApp();
      tg?.ready();
      tg?.expand();
      try {
        const userData = await api<any>('/api/auth/verify', { 
          method: 'POST', 
          body: JSON.stringify({ initData: tg?.initData || 'demo' }) 
        });
        setUser(userData);
      } catch (e) {
        console.error("Failed to auth", e);
        // Fallback for dev
        setUser({ id: 'demo-user', name: 'Nexus Voyager', balance: 500, referralCount: 0 });
      } finally {
        setLoaded(true);
      }
    };
    initApp();
  }, [setUser, setLoaded]);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}