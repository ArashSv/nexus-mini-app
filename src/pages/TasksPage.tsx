import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Star, Zap, Clock, RefreshCw } from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useAppStore } from '@/store/useAppStore';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Task, TaskResponse, ApiResponse } from '@shared/types';
export function TasksPage() {
  const queryClient = useQueryClient();
  const userId = useAppStore((s) => s.user?.id);
  const updateBalance = useAppStore((s) => s.updateBalance);
  const { data, isLoading, isRefetching, refetch } = useQuery<TaskResponse>({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      const res = await api<ApiResponse<TaskResponse>>(`/api/user/${userId || 'me'}/tasks`);
      return res.data!;
    },
    enabled: !!userId,
  });
  const completeMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const res = await api<ApiResponse<{ ok: boolean; updatedTask: Task }>>(`/api/user/${userId || 'me'}/tasks/${taskId}/complete`, {
        method: 'POST',
      });
      return res.data!;
    },
    onSuccess: (resp) => {
      hapticFeedback.notification('success');
      updateBalance(resp.updatedTask.reward);
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    },
  });
  const renderTaskSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <GlassCard key={i} className="p-4 mb-3 border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-white/5" />
                <Skeleton className="h-3 w-16 bg-white/5" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-full bg-white/5" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
  const renderTask = (task: Task, idx: number) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      <GlassCard className="p-4 mb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              {task.done ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Star className="w-5 h-5 text-blue-400" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white leading-tight">{task.title}</h3>
              {task.description && <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>}
              <div className="flex items-center gap-1 text-blue-400 font-bold text-xs mt-1">
                <Zap className="w-3 h-3 fill-current" />
                +{task.reward} NEX
              </div>
            </div>
          </div>
          <Button
            size="sm"
            disabled={task.done || completeMutation.isPending}
            onClick={() => {
              if (task.done) return;
              hapticFeedback.impact('light');
              completeMutation.mutate(task.id);
            }}
            className={cn(
              "rounded-full px-4 h-8 text-xs font-bold shrink-0",
              task.done
                ? "bg-green-500/20 text-green-400 border border-green-500/20"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            )}
          >
            {task.done ? "Claimed" : (completeMutation.isPending ? "..." : "Start")}
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-black text-white">Nexus Hub</h1>
          <p className="text-slate-400 text-sm">Complete missions for NEX rewards.</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/5 hover:bg-white/10"
          onClick={() => {
            hapticFeedback.impact('medium');
            refetch();
          }}
          disabled={isRefetching}
        >
          <RefreshCw className={cn("w-4 h-4 text-slate-400", isRefetching && "animate-spin")} />
        </Button>
      </div>
      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-40 w-full rounded-3xl bg-white/5" />
          {renderTaskSkeleton()}
        </div>
      ) : (
        <div className="space-y-8 pb-20">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-800 shadow-glow relative overflow-hidden"
          >
            <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Season 1</span>
              <h2 className="text-xl font-black text-white mt-1">Founders Airdrop</h2>
              <p className="text-blue-100 text-xs mt-2 max-w-[200px]">Complete community tasks to qualify for the genesis pool.</p>
            </div>
            <Zap className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-white/10 rotate-12" />
          </motion.div>
          {data?.sections.map((section) => (
            <section key={section.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.tasks.map((task, idx) => renderTask(task, idx))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}