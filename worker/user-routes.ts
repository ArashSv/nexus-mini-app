import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH
  app.post('/api/auth/verify', async (c) => {
    // In a real app, validate telegram initData here
    const mockUser = {
      id: 'u_' + Math.random().toString(36).slice(2, 9),
      name: 'Nexus Explorer',
      balance: 1250,
      referralCount: 5
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
  // FALLBACKS
  app.get('/api/user/:id', async (c) => {
    return ok(c, { id: c.req.param('id'), name: 'Nexus Explorer', balance: 1250 });
  });
}