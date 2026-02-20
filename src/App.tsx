import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { TasksPage } from '@/pages/TasksPage';
import { WalletPage } from '@/pages/WalletPage';
import { ReferralPage } from '@/pages/ReferralPage';
import { MorePage } from '@/pages/MorePage';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api-client';
import { Toaster } from '@/components/ui/sonner';
import { getTelegramWebApp } from '@/lib/telegram';
import { User } from '@shared/types';
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: '/',
    element: <MobileLayout />,
    children: [
      { index: true, element: <TasksPage /> },
      { path: 'wallet', element: <WalletPage /> },
      { path: 'referral', element: <ReferralPage /> },
      { path: 'more', element: <MorePage /> },
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
        const initData = tg?.initData || 'demo';
        const userData = await api<User>('/api/auth/verify', {
          method: 'POST',
          body: JSON.stringify({ initData })
        });
        if (userData && typeof userData === 'object') {
          setUser(userData);
        } else {
          throw new Error('Invalid user data received');
        }
      } catch (e) {
        console.error("[CRITICAL] Auth verification failed. Falling back to demo mode.", e);
        // Robust fallback for development/failures
        setUser({
          id: 'demo-user',
          displayName: 'Nexus Voyager',
          balanceNEX: 500,
          balanceUSD: 15.00,
          referralCount: 0,
          totalEarned: 500,
          referralLink: 'https://t.me/nexus_bot?start=ref123'
        });
      } finally {
        setLoaded(true);
      }
    };
    initApp();
  }, [setUser, setLoaded]);
  return (
    <TonConnectUIProvider manifestUrl="https://nexus-mini-app.pages.dev/tonconnect-manifest.json">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </QueryClientProvider>
    </TonConnectUIProvider>
  );
}