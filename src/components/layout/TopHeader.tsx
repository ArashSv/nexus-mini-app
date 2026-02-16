import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Wallet, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
export function TopHeader() {
  const user = useAppStore((s) => s.user);
  const isLoaded = useAppStore((s) => s.isLoaded);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 flex items-center justify-between pointer-events-none">
      <div className="flex gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-soft">
          <Wallet className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold">
            {!isLoaded ? "..." : `${user?.balance?.toLocaleString() ?? 0} NEX`}
          </span>
        </div>
      </div>
      <div className="flex gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-soft">
          <span className="text-xs font-medium max-w-[80px] truncate">
            {user?.name || "Guest"}
          </span>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <UserIcon className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}