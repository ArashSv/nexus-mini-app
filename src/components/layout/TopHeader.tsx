import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Wallet, User as UserIcon } from 'lucide-react';
export function TopHeader() {
  const balanceNEX = useAppStore((s) => s.user?.balanceNEX);
  const displayName = useAppStore((s) => s.user?.displayName);
  const isLoaded = useAppStore((s) => s.isLoaded);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 flex items-center justify-between pointer-events-none">
      <div className="flex gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-lg border border-white/10 text-white shadow-glass">
          <Wallet className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-black tracking-tight">
            {!isLoaded ? "..." : `${balanceNEX?.toLocaleString() ?? 0} NEX`}
          </span>
        </div>
      </div>
      <div className="flex gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-lg border border-white/10 text-white shadow-glass">
          <span className="text-[10px] font-bold max-w-[80px] truncate uppercase tracking-tighter">
            {displayName || "Guest"}
          </span>
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border border-white/10">
            <UserIcon className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}