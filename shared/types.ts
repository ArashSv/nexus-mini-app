export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  balanceUSD: number;
  balanceNEX: number;
  walletAddress?: string;
  referralLink: string;
  totalEarned: number;
  referralCount: number;
}
export interface Task {
  id: string;
  title: string;
  description?: string;
  reward: number;
  done: boolean;
  meta?: {
    category?: 'daily' | 'weekly' | 'optional';
    icon?: string;
    link?: string;
  };
}
export interface Transaction {
  id: string;
  timestamp: number;
  type: 'in' | 'out';
  amountTON: number;
  amountNEX?: number;
  status: 'pending' | 'success' | 'failed';
  txHash?: string;
}
export interface Referral {
  link: string;
  countInvited: number;
  totalEarnings: number;
  invited: Array<{
    id: string;
    name: string;
    joinedAt: number;
    contribution: number;
  }>;
}
export interface WithdrawalRequest {
  withdrawalId: string;
  status: 'pending' | 'confirmed';
}
export interface TaskSection {
  id: string;
  title: string;
  tasks: Task[];
}
export interface TaskResponse {
  sections: TaskSection[];
}