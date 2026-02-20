import React, { useState } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { useQuery } from '@tanstack/react-query';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Wallet, ArrowDownLeft, ArrowUpRight, History, Zap, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { hapticFeedback } from '@/lib/telegram';
import { api } from '@/lib/api-client';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { Transaction, WithdrawalRequest } from '@shared/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
export function WalletPage() {
  const user = useAppStore((s) => s.user);
  const address = useTonAddress();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const { data: txData, isLoading, error } = useQuery<{ transactions: Transaction[] }>({
    queryKey: ['transactions', user?.id],
    queryFn: () => api<{ transactions: Transaction[] }>(`/api/user/${user?.id}/transactions`),
    enabled: !!user?.id,
  });
  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const resp = await api<WithdrawalRequest>(`/api/wallet/withdraw`, {
        method: 'POST',
        body: JSON.stringify({ amountTON: Number(withdrawAmount), destAddress: withdrawAddress })
      });
      hapticFeedback.notification('success');
      toast.success("Withdrawal initiated!", {
        description: `Request ID: ${resp.withdrawalId.slice(0, 8)}...`
      });
      setWithdrawAmount('');
      setWithdrawAddress('');
    } catch (e) {
      toast.error("Withdrawal failed");
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-black text-white">Digital Wallet</h1>
        <p className="text-slate-400 text-sm">Manage your NEX assets and TON connection.</p>
      </div>
      <GlassCard className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-white/20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Available Balance</p>
            <h2 className="text-4xl font-black text-white mt-1">
              {user?.balanceNEX?.toLocaleString() ?? 0} <span className="text-xl font-normal text-blue-300">NEX</span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-medium">≈ ${user?.balanceUSD?.toFixed(2) || '0.00'} USD</p>
          </div>
          <Zap className="w-8 h-8 text-yellow-400 fill-current animate-pulse" />
        </div>
        <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">TON Network</span>
            <div className="scale-90 origin-right">
              <TonConnectButton />
            </div>
          </div>
        </div>
      </GlassCard>
      <div className="grid grid-cols-2 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 rounded-2xl bg-white/5 border-white/10 flex flex-col gap-1 hover:bg-white/10 transition-all" onClick={() => hapticFeedback.impact('light')}>
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
              <span className="text-xs font-bold uppercase tracking-tight">Deposit</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-[90%] rounded-3xl">
            <DialogHeader><DialogTitle className="text-center">Deposit Assets</DialogTitle></DialogHeader>
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="p-4 bg-white rounded-2xl">
                <QRCode value={address || 'Connect Wallet to see address'} size={180} />
              </div>
              <p className="text-center text-xs text-slate-400 px-4">Transfer TON or NEX to this address to top up your balance.</p>
              <Button disabled={!address} className="w-full h-12 rounded-xl bg-blue-600 font-bold" onClick={() => { if(address) { navigator.clipboard.writeText(address); toast.success("Copied!"); }}}>
                {address ? "Copy Address" : "Connect Wallet First"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-20 rounded-2xl bg-white/5 border-white/10 flex flex-col gap-1 hover:bg-white/10 transition-all" onClick={() => hapticFeedback.impact('light')}>
              <ArrowUpRight className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-tight">Withdraw</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-[90%] rounded-3xl">
            <DialogHeader><DialogTitle>Withdraw Assets</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Amount (NEX)</label>
                <Input placeholder="0.00" type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} className="bg-black/20 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Destination Wallet</label>
                <Input placeholder="UQ..." value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} className="bg-black/20 border-white/10" />
              </div>
              <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold" onClick={handleWithdraw}>Submit Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4 pb-20">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Activity History</h2>
        </div>
        {error ? (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center gap-3 border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <p className="text-sm text-slate-300">Failed to load history</p>
            <Button variant="ghost" size="sm" className="text-blue-400 font-bold" onClick={() => window.location.reload()}>Retry</Button>
          </GlassCard>
        ) : isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl bg-white/5" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {txData?.transactions.map((tx) => (
              <GlassCard key={tx.id} className="p-4 flex items-center justify-between border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'in' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                    {tx.type === 'in' ? <ArrowDownLeft className="w-4 h-4 text-green-400" /> : <ArrowUpRight className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase">{tx.type === 'in' ? 'Deposit' : 'Withdrawal'}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{format(tx.timestamp, 'MMM dd, HH:mm')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${tx.type === 'in' ? 'text-green-400' : 'text-blue-400'}`}>
                    {tx.type === 'in' ? '+' : '-'}{tx.amountNEX || 0} NEX
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{tx.status}</p>
                </div>
              </GlassCard>
            ))}
            {txData?.transactions.length === 0 && (
              <p className="text-center text-slate-600 text-sm py-10 italic">No recent activity.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}