import { create } from 'zustand';
interface UserProfile {
  id: string;
  name: string;
  balance: number;
  referralCount: number;
  totalEarned: number;
  referralLink?: string;
  walletAddress?: string;
}
interface AppState {
  user: UserProfile | null;
  isLoaded: boolean;
  setUser: (user: UserProfile) => void;
  updateBalance: (amount: number) => void;
  setLoaded: (loaded: boolean) => void;
  setWalletAddress: (address: string) => void;
}
export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoaded: false,
  setUser: (user) => set({ user }),
  updateBalance: (amount) => set((state) => ({
    user: state.user ? { 
      ...state.user, 
      balance: state.user.balance + amount,
      totalEarned: state.user.totalEarned + (amount > 0 ? amount : 0)
    } : null
  })),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setWalletAddress: (address) => set((state) => ({
    user: state.user ? { ...state.user, walletAddress: address } : null
  })),
}));