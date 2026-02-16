import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Zap, Clock } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
interface Task {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'one-time';
}
export function TasksPage() {
  const queryClient = useQueryClient();
  const userId = useAppStore((s) => s.user?.id);
  const updateBalance = useAppStore((s) => s.updateBalance);
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', userId],
    queryFn: () => api<Task[]>(`/api/user/${userId || 'me'}/tasks`),
    enabled: !!userId,
  });
  const completeMutation = useMutation({
    mutationFn: (taskId: string) =>
      api<{ reward: number }>(`/api/user/${userId || 'me'}/tasks/complete`, {
        method: 'POST',
        body: JSON.stringify({ taskId }),
      }),
    onSuccess: (data, taskId) => {
      hapticFeedback.notification('success');
      updateBalance(data.reward);
      queryClient.setQueryData(['tasks', userId], (old: Task[] | undefined) =>
        old?.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
      );
    },
  });
  const renderTask = (task: Task, idx: number) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      <GlassCard className="p-4 mb-3 transition-all active:scale-[0.98]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              {task.completed ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Star className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{task.title}</h3>
              <div className="flex items-center gap-1 text-blue-400 font-bold text-xs">
                <Zap className="w-3 h-3 fill-current" />
                +{task.reward} NEX
              </div>
            </div>
          </div>
          <Button
            size="sm"
            disabled={task.completed || completeMutation.isPending}
            onClick={() => {
              hapticFeedback.impact('light');
              completeMutation.mutate(task.id);
            }}
            className={cn(
              "rounded-full px-4 h-8 text-xs font-bold transition-all",
              task.completed 
                ? "bg-green-500/20 text-green-400 border border-green-500/20" 
                : "bg-blue-600 hover:bg-blue-500 text-white"
            )}
          >
            {task.completed ? "Claimed" : "Start"}
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
  return (
    <div className="animate-fade-in space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-black text-white">Nexus Hub</h1>
        <p className="text-slate-400 text-sm">Complete tasks to earn NEX tokens daily.</p>
      </div>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 shadow-glow relative overflow-hidden"
      >
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Featured Pool</span>
          <h2 className="text-xl font-black text-white mt-1">Daily Streak Reward</h2>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-700 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                  {i}
                </div>
              ))}
            </div>
            <span className="text-xs text-blue-100 font-medium">Earn +500 NEX extra</span>
          </div>
        </div>
        <Zap className="absolute right-[-20px] bottom-[-20px] w-40 h-40 text-white/10 rotate-12" />
      </motion.div>
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Available Tasks</h2>
        </div>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full mb-3 rounded-2xl bg-white/5" />
          ))
        ) : (
          <div className="pb-10">
            {tasks?.map((task, idx) => renderTask(task, idx))}
          </div>
        )}
      </section>
    </div>
  );
}