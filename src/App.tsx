import React, { useEffect, Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api-client';
import { Toaster } from '@/components/ui/sonner';
import { getTelegramWebApp, expandWebApp } from '@/lib/telegram';
import { User } from '@shared/types';
import ErrorBoundary from '@/components/ErrorBoundary';
// Lazy loaded pages for performance
const TasksPage = lazy(() => import('@/pages/TasksPage').then(m => ({ default: m.TasksPage })));
const WalletPage = lazy(() => import('@/pages/WalletPage').then(m => ({ default: m.WalletPage })));
const ReferralPage = lazy(() => import('@/pages/ReferralPage').then(m => ({ default: m.ReferralPage })));
const MorePage = lazy(() => import('@/pages/MorePage').then(m => ({ default: m.MorePage })));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
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
function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100]">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground">Nexus is loading...</p>
    </div>
  );
}
export default function App() {
  const setUser = useAppStore((s) => s.setUser);
  const setLoaded = useAppStore((s) => s.setLoaded);
  useEffect(() => {
    const initApp = async () => {
      const tg = getTelegramWebApp();
      tg?.ready();
      expandWebApp();
      try {
        // Try to load cached user first for instant UX
        const cached = localStorage.getItem('nexus_user');
        if (cached) {
          setUser(JSON.parse(cached));
        }
        const initData = tg?.initData || 'demo';
        const userData = await api<User>('/api/auth/verify', {
          method: 'POST',
          body: JSON.stringify({ initData })
        });
        if (userData && typeof userData === 'object') {
          setUser(userData);
          localStorage.setItem('nexus_user', JSON.stringify(userData));
        }
      } catch (e) {
        console.warn("[APP] Auth fallback used:", e);
      } finally {
        setLoaded(true);
      }
    };
    initApp();
  }, [setUser, setLoaded]);
  return (
    <ErrorBoundary>
      <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<GlobalLoading />}>
            <RouterProvider router={router} />
          </Suspense>
        </QueryClientProvider>
        <Toaster position="top-center" richColors theme="dark" />
      </TonConnectUIProvider>
    </ErrorBoundary>
  );
}