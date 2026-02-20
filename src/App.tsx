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
import { ErrorBoundary } from '@/components/ErrorBoundary';
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
    <div className="fixed inset-0 bg-[#0F172A] flex flex-col items-center justify-center z-[100]">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse flex items-center justify-center shadow-glow">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
      <p className="mt-6 text-sm font-bold tracking-widest text-blue-400 uppercase animate-pulse">Initializing Nexus</p>
    </div>
  );
}
export default function App() {
  const setUser = useAppStore((s) => s.setUser);
  const setLoaded = useAppStore((s) => s.setLoaded);
  useEffect(() => {
    const initApp = async () => {
      const tg = getTelegramWebApp();
      if (tg) {
        tg.ready();
        expandWebApp();
      }
      try {
        const cached = localStorage.getItem('nexus_user');
        if (cached) {
          setUser(JSON.parse(cached));
        }
        const initData = tg?.initData || 'demo';
        // Match the backend expectation: JSON body with initData field
        const response = await api<{ success: boolean; data: User }>('/api/auth/verify', {
          method: 'POST',
          body: JSON.stringify({ initData })
        });
        if (response?.success && response?.data) {
          setUser(response.data);
          localStorage.setItem('nexus_user', JSON.stringify(response.data));
        }
      } catch (e) {
        console.warn("[APP] Auth verification failed. Falling back to demo mode.", e);
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