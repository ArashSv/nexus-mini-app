# Nexus Telegram Mini App - API Documentation
## Overview
- **Base URL**: `https://api.nexus.workers.dev` (Production)
- **Auth**: All user-specific endpoints require valid Telegram `initData` verification via `/auth/verify`.
- **Responses**: All responses follow the structure: `{ success: boolean, data?: T, error?: string }`
- **TON Integration**: Frontend uses `@tonconnect/ui-react` for wallet interactions; the backend validates and synchronizes TON addresses and transactions.
- **Content-Type**: `application/json`
## Data Models
### User
```typescript
interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  balanceUSD: number;
  balanceNEX: number; // Native App token
  walletAddress?: string;
  referralLink: string;
  totalEarned: number;
  referralCount: number;
}
```
### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  reward: number; // NEX amount
  done: boolean;
  meta?: {
    category?: 'daily' | 'weekly' | 'optional';
    icon?: string;
    link?: string;
  };
}
```
### Transaction
```typescript
interface Transaction {
  id: string;
  timestamp: number;
  type: 'in' | 'out';
  amountTON: number;
  amountNEX?: number;
  status: 'pending' | 'success' | 'failed';
  txHash?: string;
}
```
### Referral
```typescript
interface Referral {
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
```
## Endpoints
### Authentication
| Method | Path | Request Body | Response | Notes |
|--------|------|--------------|----------|-------|
| POST | `/api/auth/verify` | `{ initData: string }` | `User` | Verifies Telegram hash; creates/retrieves profile. |
### User & Tasks
| Method | Path | Request Body | Response | Notes |
|--------|------|--------------|----------|-------|
| GET | `/api/user/{userId}` | N/A | `User` | Fetch full profile. |
| GET | `/api/user/{userId}/tasks` | N/A | `{ sections: Array<{ id: string, title: string, tasks: Task[] }> }` | Organized by urgency/type. |
| POST | `/api/user/{userId}/tasks/{taskId}/complete` | `{}` | `{ ok: true, updatedTask: Task }` | Validates completion and adds reward. |
### Wallet (TONConnect)
| Method | Path | Request Body | Response | Notes |
|--------|------|--------------|----------|-------|
| POST | `/api/wallet/connect` | `{ userId: string, walletAddress: string }` | `{ ok: true }` | Maps user to verified TON address. |
| GET | `/api/user/{userId}/transactions` | N/A | `{ transactions: Transaction[] }` | Paginated history of token movements. |
| POST | `/api/wallet/withdraw` | `{ amountTON: number, destAddress: string }` | `WithdrawalRequest` | Initiates off-ramp process. |
### Referrals
| Method | Path | Request Body | Response | Notes |
|--------|------|--------------|----------|-------|
| GET | `/api/user/{userId}/referral` | N/A | `Referral` | Performance stats and invitee list. |
## Backend Implementation Notes
- **Verification**: Use `WebAppData` validation algorithms with `BOT_TOKEN`.
- **Storage**: Durable Objects for atomic balance updates; KV for read-heavy profile data.
- **TON RPC**: Use Toncenter or Getgems API for balance/transaction lookups.
## Deployment
- **Frontend**: Cloudflare Pages (Vite).
- **Backend**: Cloudflare Workers.