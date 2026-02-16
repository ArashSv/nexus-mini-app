import React, { useState } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, ArrowDownLeft, ArrowUpRight, History, QrCode, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { hapticFeedback } from '@/lib/telegram';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
export function WalletPage() {
  const user = useAppStore((s) => s.user);
  const address = useTonAddress();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const handleWithdraw = () => {
    if (!withdrawAmount || !withdrawAddress) {
      toast.error("Please fill all fields");
      return;
    }
    hapticFeedback.notification('success');
    toast.success("Withdrawal initiated!", {
      description: `Sending ${withdrawAmount} NEX to ${withdrawAddress.slice(0, 6)}...`
    });
    setWithdrawAmount('');
    setWithdrawAddress('');
  };
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-black text-white">Digital Wallet</h1>
        <p className="text-slate-400 text-sm">Manage your NEX tokens and TON assets.</p>
      </div>
      <GlassCard className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-white/20">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">NEX Balance</p>
            <h2 className="text-4xl font-black text-white mt-1">
              {user?.balance?.toLocaleString() ?? 0} <span className="text-xl font-normal text-blue-300">NEX</span>
            </h2>
          </div>
          <Zap className="w-8 h-8 text-yellow-400 fill-current" />
        </div>
        <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">TON Wallet</span>
            <TonConnectButton />
          </div>
          {address && (
            <div className="bg-black/20 p-2 rounded-lg text-[10px] font-mono text-blue-300 break-all text-center">
              {address}
            </div>
          )}
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-16 rounded-2xl bg-white/5 border-white/10 flex flex-col gap-1 hover:bg-white/10" onClick={() => hapticFeedback.impact('light')}>
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
              <span className="text-xs font-bold">Deposit</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-[90%] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-center">Deposit NEX</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="p-4 bg-white rounded-2xl">
                <QRCode value={address || 'Connect Wallet First'} size={200} />
              </div>
              <p className="text-center text-sm text-slate-400 px-4">
                Scan this QR code to deposit NEX or TON to your personal Nexus address.
              </p>
              <Button className="w-full rounded-xl bg-blue-600 font-bold" onClick={() => {
                navigator.clipboard.writeText(address);
                toast.success("Address copied!");
              }}>Copy Address</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-16 rounded-2xl bg-white/5 border-white/10 flex flex-col gap-1 hover:bg-white/10" onClick={() => hapticFeedback.impact('light')}>
              <ArrowUpRight className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold">Withdraw</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-[90%] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Amount (NEX)</label>
                <Input 
                  placeholder="0.00" 
                  type="number" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-black/20 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Wallet Address</label>
                <Input 
                  placeholder="UQ..." 
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="bg-black/20 border-white/10 text-white h-12 rounded-xl"
                />
              </div>
              <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold mt-2" onClick={handleWithdraw}>
                Confirm Withdrawal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recent Activity</h2>
        </div>
        <div className="space-y-2">
          {[
            { id: 1, type: 'Task Reward', amount: '+100', status: 'Success', date: 'Today' },
            { id: 2, type: 'Referral Bonus', amount: '+250', status: 'Success', date: 'Yesterday' },
            { id: 3, type: 'Withdrawal', amount: '-500', status: 'Pending', date: '2 days ago' },
          ].map((tx) => (
            <GlassCard key={tx.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount.startsWith('+') ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                  {tx.amount.startsWith('+') ? <ArrowDownLeft className="w-5 h-5 text-green-400" /> : <ArrowUpRight className="w-5 h-5 text-blue-400" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{tx.type}</p>
                  <p className="text-[10px] text-slate-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-blue-400'}`}>
                  {tx.amount} NEX
                </p>
                <p className="text-[10px] text-slate-500">{tx.status}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}