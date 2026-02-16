import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  Globe, 
  MessageSquare, 
  Twitter, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  ExternalLink 
} from 'lucide-react';
import { hapticFeedback } from '@/lib/telegram';
import { useTonConnectUI } from '@tonconnect/ui-react';
export function MorePage() {
  const [tonConnectUI] = useTonConnectUI();
  const handleLink = (url: string) => {
    hapticFeedback.impact('light');
    window.open(url, '_blank');
  };
  const handleDisconnect = async () => {
    hapticFeedback.notification('warning');
    await tonConnectUI.disconnect();
  };
  const sections = [
    {
      title: 'Community',
      items: [
        { label: 'Telegram Channel', icon: MessageSquare, url: 'https://t.me/nexus_community' },
        { label: 'Follow on X', icon: Twitter, url: 'https://twitter.com/nexus_app' },
        { label: 'Official Website', icon: Globe, url: 'https://nexus-mini-app.pages.dev' },
      ]
    },
    {
      title: 'Support & Security',
      items: [
        { label: 'How it Works', icon: HelpCircle, url: '#' },
        { label: 'Privacy Policy', icon: ShieldCheck, url: '#' },
      ]
    }
  ];
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-display font-black text-white">More Options</h1>
        <p className="text-slate-400 text-sm">Nexus environment and settings.</p>
      </div>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">
              {section.title}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <GlassCard 
                  key={item.label}
                  className="p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                  onClick={() => handleLink(item.url)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5">
                      <item.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
        <div className="space-y-3 pt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 ml-2">
            Account
          </h2>
          <GlassCard 
            className="p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all border-red-500/20 bg-red-500/5"
            onClick={handleDisconnect}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/10">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-sm font-semibold text-red-200">Disconnect Wallet</span>
            </div>
          </GlassCard>
        </div>
      </div>
      <footer className="text-center py-8">
        <p className="text-[10px] text-slate-600 font-mono">Nexus v1.0.4 - Mainnet Beta</p>
      </footer>
    </div>
  );
}