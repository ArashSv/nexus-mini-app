import { create } from 'zustand';
import { User } from '@shared/types';
interface AppState {
  user: User | null;
  isLoaded: boolean;
  error: string | null;
  setUser: (user: User) => void;
  updateBalance: (amount: number) => void;
  setLoaded: (loaded: boolean) => void;
  setWalletAddress: (address: string) => void;
  setError: (error: string | null) => void;
}
export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoaded: false,
  error: null,
  setUser: (user) => {
    set({ user });
    // Side effect: persistence
    localStorage.setItem('nexus_user', JSON.stringify(user));
  },
  updateBalance: (amount) => set((state) => {
    if (!state.user) return state;
    const newUser = {
      ...state.user,
      balanceNEX: state.user.balanceNEX + amount,
      totalEarned: state.user.totalEarned + (amount > 0 ? amount : 0)
    };
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
    return { user: newUser };
  }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
  setWalletAddress: (address) => set((state) => {
    if (!state.user) return state;
    const newUser = { ...state.user, walletAddress: address };
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
    return { user: newUser };
  }),
  setError: (error) => set({ error }),
}));