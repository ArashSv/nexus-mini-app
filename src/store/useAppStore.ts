import { create } from 'zustand';
interface UserProfile {
  id: string;
  name: string;
  balance: number;
  referralCount: number;
}
interface AppState {
  user: UserProfile | null;
  isLoaded: boolean;
  setUser: (user: UserProfile) => void;
  updateBalance: (amount: number) => void;
  setLoaded: (loaded: boolean) => void;
}
export const useAppStore = create<AppState>((set) => ({
  user: null,
  isLoaded: false,
  setUser: (user) => set({ user }),
  updateBalance: (amount) => set((state) => ({
    user: state.user ? { ...state.user, balance: state.user.balance + amount } : null
  })),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}));