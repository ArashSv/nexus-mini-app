import type { User, Chat, ChatMessage } from './types';
export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    displayName: 'User A', 
    name: 'User A',
    balanceUSD: 10, 
    balanceNEX: 100, 
    referralLink: '', 
    totalEarned: 100, 
    referralCount: 0 
  },
  { 
    id: 'u2', 
    displayName: 'User B', 
    name: 'User B',
    balanceUSD: 20, 
    balanceNEX: 200, 
    referralLink: '', 
    totalEarned: 200, 
    referralCount: 0 
  }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];