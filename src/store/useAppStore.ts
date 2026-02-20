import { create } from 'zustand';
import { User } from '@shared/types';
interface AppState {
  user: User | null;
  isLoaded: boolean;
  setUser: (user: User) => void;
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
      balanceNEX: state.user.balanceNEX + amount,
      totalEarned: state.user.totalEarned + (amount > 0 ? amount : 0)
    } : null
  })),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setWalletAddress: (address) => set((state) => ({
    user: state.user ? { ...state.user, walletAddress: address } : null
  })),
}));