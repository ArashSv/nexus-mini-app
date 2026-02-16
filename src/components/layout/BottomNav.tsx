import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wallet, Users, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hapticFeedback } from '@/lib/telegram';
const navItems = [
  { path: '/', label: 'Tasks', icon: Home },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
  { path: '/referral', label: 'Referral', icon: Users },
  { path: '/more', label: 'More', icon: MoreHorizontal },
];
export function BottomNav() {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
      <div className="flex items-center justify-around p-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => hapticFeedback.selection()}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                isActive ? "text-blue-400" : "text-slate-400"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-blue-500/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}