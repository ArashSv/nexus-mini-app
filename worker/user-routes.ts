import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH
  app.post('/api/auth/verify', async (c) => {
    const mockUser = {
      id: 'u_' + Math.random().toString(36).slice(2, 9),
      name: 'Nexus Explorer',
      balance: 1250,
      totalEarned: 2400,
      referralCount: 5,
      referralLink: 'https://t.me/nexus_bot?start=r_exp'
    };
    return ok(c, mockUser);
  });
  // TASKS
  app.get('/api/user/:id/tasks', async (c) => {
    const tasks = [
      { id: 't1', title: 'Follow Nexus on X', reward: 100, completed: false, category: 'one-time' },
      { id: 't2', title: 'Join Telegram Channel', reward: 150, completed: false, category: 'one-time' },
      { id: 't3', title: 'Daily Check-in', reward: 50, completed: false, category: 'daily' },
      { id: 't4', title: 'Invite 3 Friends', reward: 500, completed: false, category: 'weekly' },
    ];
    return ok(c, tasks);
  });
  app.post('/api/user/:id/tasks/complete', async (c) => {
    const { taskId } = await c.req.json();
    const rewards: Record<string, number> = { t1: 100, t2: 150, t3: 50, t4: 500 };
    return ok(c, { success: true, reward: rewards[taskId] || 0 });
  });
  // WALLET
  app.get('/api/user/:id/wallet/history', async (c) => {
    const history = [
      { id: 'tx1', type: 'Task Reward', amount: 100, status: 'Success', date: '2024-05-10' },
      { id: 'tx2', type: 'Referral Bonus', amount: 150, status: 'Success', date: '2024-05-09' },
    ];
    return ok(c, history);
  });
  app.post('/api/user/:id/withdraw', async (c) => {
    const body = await c.req.json();
    if (!body.amount || body.amount <= 0) return bad(c, 'Invalid amount');
    // Simulate processing
    return ok(c, { txHash: '0x' + Math.random().toString(16).slice(2, 10), status: 'pending' });
  });
  // REFERRALS
  app.get('/api/user/:id/referrals', async (c) => {
    const referrals = [
      { id: 'r1', name: 'AlphaUser', earnings: 150, joined: '2024-05-08' },
      { id: 'r2', name: 'BetaTester', earnings: 300, joined: '2024-05-07' },
    ];
    return ok(c, { totalInvites: 5, totalEarnings: 750, items: referrals });
  });
  // FALLBACKS
  app.get('/api/user/:id', async (c) => {
    return ok(c, { id: c.req.param('id'), name: 'Nexus Explorer', balance: 1250 });
  });
}