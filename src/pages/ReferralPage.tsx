import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Users, Copy, Share2, Award, Zap, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { hapticFeedback } from '@/lib/telegram';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
export function ReferralPage() {
  const user = useAppStore((s) => s.user);
  const referralLink = user?.referralLink || 'https://t.me/nexus_bot?start=nexus';
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    hapticFeedback.notification('success');
    toast.success("Link copied to clipboard!");
  };
  const handleShare = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join Nexus and start earning tokens today! 🚀")}`;
    window.open(url, '_blank');
    hapticFeedback.impact('medium');
  };
  return (
    <div className="animate-fade-in space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-blue-500/10 mb-2">
          <Users className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-2xl font-display font-black text-white">Invite Friends</h1>
        <p className="text-slate-400 text-sm max-w-[280px] mx-auto">
          Share your link and earn <span className="text-blue-400 font-bold">10%</span> of all tokens your friends earn.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Invites</p>
          <p className="text-2xl font-black text-white">{user?.referralCount || 0}</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">NEX Earned</p>
          <div className="flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-yellow-400 fill-current" />
            <p className="text-2xl font-black text-white">{(user?.referralCount || 0) * 150}</p>
          </div>
        </GlassCard>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <input 
            readOnly 
            value={referralLink}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pr-12 text-sm font-medium text-blue-300 focus:outline-none"
          />
          <button 
            onClick={handleCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
        <Button 
          onClick={handleShare}
          className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-glow transition-all active:scale-95"
        >
          <Share2 className="w-5 h-5 mr-2" />
          Invite via Telegram
        </Button>
      </div>
      <div className="space-y-4 pb-10">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Referral Leaderboard</h2>
        </div>
        <div className="space-y-2">
          {[
            { id: 1, name: 'CryptoPioneer', joined: '2h ago', earnings: 450 },
            { id: 2, name: 'Web3Voyager', joined: 'Yesterday', earnings: 1200 },
            { id: 3, name: 'NexusNova', joined: '2 days ago', earnings: 300 },
          ].map((ref, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={ref.id}
            >
              <GlassCard className="p-4 flex items-center justify-between border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs">
                    {ref.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{ref.name}</p>
                    <p className="text-[10px] text-slate-500">Joined {ref.joined}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-black text-green-400">+{ref.earnings} NEX</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}