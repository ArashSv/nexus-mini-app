import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Share2, Award, Zap, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { hapticFeedback } from '@/lib/telegram';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Referral, ApiResponse } from '@shared/types';
import { format } from 'date-fns';
export function ReferralPage() {
  const userId = useAppStore((s) => s.user?.id);
  const storeReferralLink = useAppStore((s) => s.user?.referralLink);
  const { data: refData, isLoading } = useQuery<Referral>({
    queryKey: ['referrals', userId],
    queryFn: async () => {
      const res = await api<ApiResponse<Referral>>(`/api/user/${userId}/referral`);
      return res.data!;
    },
    enabled: !!userId,
  });
  const referralLink = refData?.link || storeReferralLink || '';
  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      hapticFeedback.notification('success');
      toast.success("Link copied!");
    }
  };
  const handleShare = () => {
    const text = "Join Nexus and start earning tokens today! 🚀";
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    hapticFeedback.impact('medium');
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12 space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-3xl bg-blue-500/10">
            <Users className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-2xl font-display font-black text-white">Referral Program</h1>
          <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
            Earn <span className="text-blue-400 font-bold">10% commission</span> on every NEX token your friends earn.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-5 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Friends Joined</p>
            <p className="text-3xl font-black text-white">{refData?.countInvited ?? 0}</p>
          </GlassCard>
          <GlassCard className="p-5 text-center">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Bonus Earned</p>
            <div className="flex items-center justify-center gap-1">
              <Zap className="w-5 h-5 text-yellow-400 fill-current" />
              <p className="text-3xl font-black text-white">{refData?.totalEarnings ?? 0}</p>
            </div>
          </GlassCard>
        </div>
        <div className="space-y-4">
          <div className="relative group">
            <input
              readOnly
              value={referralLink}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm font-medium text-blue-300 transition-all focus:border-blue-500/50 outline-none"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 active:scale-90 transition-all"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={handleShare}
            className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-glow active:scale-[0.98] transition-all"
          >
            <Share2 className="w-5 h-5 mr-3" />
            Invite Friends
          </Button>
        </div>
        <div className="space-y-4 pb-20">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">My Network</h2>
          </div>
          <div className="space-y-3">
            {!isLoading && refData?.invited.map((ref, idx) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={ref.id}
              >
                <GlassCard className="p-4 flex items-center justify-between border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-lg">
                      {ref.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{ref.name}</p>
                      <p className="text-[10px] text-slate-500">Joined {format(ref.joinedAt, 'MMM dd')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-black text-green-400">+{ref.contribution} NEX</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
            {!isLoading && (!refData || refData.invited.length === 0) && (
              <p className="text-center text-slate-500 text-sm py-8 italic">No referrals yet. Start inviting!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}