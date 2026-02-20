import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
import type { User, Task, Transaction, Referral, TaskResponse } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH
  app.post('/api/auth/verify', async (c) => {
    let initData = '';
    try {
      const body = await c.req.json();
      initData = body.initData || '';
    } catch (e) {
      // Fallback for non-JSON or missing body
      initData = 'demo';
    }
    if (!initData || initData === 'demo') {
      const mockUser: User = {
        id: 'u_12345',
        displayName: 'Nexus Explorer',
        avatarUrl: '',
        balanceUSD: 42.50,
        balanceNEX: 1250,
        referralLink: 'https://t.me/nexus_bot?start=r123',
        totalEarned: 2400,
        referralCount: 5,
        walletAddress: undefined
      };
      return ok(c, mockUser);
    }
    // Simple hash-based userId derivation (mock verification)
    const encoder = new TextEncoder();
    const data = encoder.encode(initData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const userId = 'u_' + hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
    const user: User = {
      id: userId,
      displayName: 'Telegram User',
      avatarUrl: '',
      balanceUSD: 0,
      balanceNEX: 0,
      referralLink: `https://t.me/nexus_bot?start=${userId.slice(2)}`,
      totalEarned: 0,
      referralCount: 0,
      walletAddress: undefined
    };
    return ok(c, user);
  });
  // USER PROFILE
  app.get('/api/user/:userId', async (c) => {
    const mockUser: User = {
      id: c.req.param('userId'),
      displayName: 'Nexus Explorer',
      avatarUrl: '',
      balanceUSD: 42.50,
      balanceNEX: 1250,
      referralLink: 'https://t.me/nexus_bot?start=r123',
      totalEarned: 2400,
      referralCount: 5,
      walletAddress: undefined
    };
    return ok(c, mockUser);
  });
  // TASKS
  app.get('/api/user/:userId/tasks', async (c) => {
    const data: TaskResponse = {
      sections: [
        {
          id: 's1',
          title: 'Daily Missions',
          tasks: [
            { id: 't1', title: 'Daily Check-in', description: 'Log in every day to earn rewards', reward: 50, done: false, meta: { category: 'daily' } }
          ]
        },
        {
          id: 's2',
          title: 'Social Growth',
          tasks: [
            { id: 't2', title: 'Join Telegram', description: 'Join our official community channel', reward: 100, done: false, meta: { category: 'optional', link: 'https://t.me/nexus' } },
            { id: 't3', title: 'Follow on X', description: 'Stay updated with our latest tweets', reward: 150, done: false, meta: { category: 'optional', link: 'https://x.com/nexus' } }
          ]
        }
      ]
    };
    return ok(c, data);
  });
  app.post('/api/user/:userId/tasks/:taskId/complete', async (c) => {
    const taskId = c.req.param('taskId');
    const updatedTask: Task = {
      id: taskId,
      title: 'Completed Task',
      reward: 100,
      done: true
    };
    return ok(c, { ok: true, updatedTask });
  });
  // WALLET
  app.get('/api/user/:userId/transactions', async (c) => {
    const limit = c.req.query('limit') || '20';
    const txs: Transaction[] = [
      { id: 'tx1', timestamp: Date.now(), type: 'in' as const, amountTON: 1.5, amountNEX: 150, status: 'success', txHash: 'abc123' },
      { id: 'tx2', timestamp: Date.now() - 86400000, type: 'in' as const, amountTON: 2.0, amountNEX: 200, status: 'success', txHash: 'def456' }
    ];
    return ok(c, { transactions: txs.slice(0, parseInt(limit)) });
  });
  app.post('/api/wallet/withdraw', async (c) => {
    return ok(c, { withdrawalId: crypto.randomUUID(), status: 'pending' });
  });
  // REFERRALS
  app.get('/api/user/:userId/referral', async (c) => {
    const data: Referral = {
      link: 'https://t.me/nexus_bot?start=r123',
      countInvited: 5,
      totalEarnings: 750,
      invited: [
        { id: 'i1', name: 'AlphaUser', joinedAt: Date.now() - 172800000, contribution: 150 },
        { id: 'i2', name: 'BetaTester', joinedAt: Date.now() - 86400000, contribution: 300 }
      ]
    };
    return ok(c, data);
  });
}