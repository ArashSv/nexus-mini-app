import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Star, Zap, Clock } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
interface Task {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
  category: 'daily' | 'weekly' | 'one-time';
}
export function TasksPage() {
  const queryClient = useQueryClient();
  const user = useAppStore((s) => s.user);
  const updateBalance = useAppStore((s) => s.updateBalance);
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', user?.id],
    queryFn: () => api<Task[]>(`/api/user/${user?.id || 'me'}/tasks`),
    enabled: !!user?.id || true,
  });
  const completeMutation = useMutation({
    mutationFn: (taskId: string) => 
      api<{ reward: number }>(`/api/user/${user?.id || 'me'}/tasks/complete`, {
        method: 'POST',
        body: JSON.stringify({ taskId }),
      }),
    onSuccess: (data, taskId) => {
      hapticFeedback.notification('success');
      updateBalance(data.reward);
      queryClient.setQueryData(['tasks', user?.id], (old: Task[] | undefined) =>
        old?.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
      );
    },
  });
  const renderTask = (task: Task) => (
    <GlassCard key={task.id} className="p-4 mb-3 transition-all active:scale-[0.98]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            {task.completed ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Star className="w-5 h-5 text-blue-400" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold">{task.title}</h3>
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
            task.completed ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-blue-600 hover:bg-blue-500 text-white"
          )}
        >
          {task.completed ? "Claimed" : "Start"}
        </Button>
      </div>
    </GlassCard>
  );
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-black text-white mb-2">Nexus Hub</h1>
        <p className="text-slate-400 text-sm">Complete tasks to earn NEX tokens daily.</p>
      </div>
      <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 shadow-glow relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Featured Pool</span>
          <h2 className="text-xl font-bold text-white">Daily Streak Reward</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-blue-600 bg-slate-800" />
              ))}
            </div>
            <span className="text-[10px] text-blue-100">+1,420 users claimed</span>
          </div>
        </div>
        <Zap className="absolute right-[-10px] top-[-10px] w-32 h-32 text-white/10 rotate-12" />
      </div>
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Available Tasks</h2>
        </div>
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full mb-3 rounded-2xl bg-white/5" />
          ))
        ) : (
          tasks?.map(renderTask)
        )}
      </section>
    </div>
  );
}
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}