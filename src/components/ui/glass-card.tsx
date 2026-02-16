import React from 'react';
import { cn } from '@/lib/utils';
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  blur?: 'sm' | 'md' | 'lg';
}
export function GlassCard({ children, className, blur = 'md', ...props }: GlassCardProps) {
  const blurClass = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  }[blur];
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glass',
        blurClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}