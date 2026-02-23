# Cloudflare Workers React Boilerplate

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ArashSv/nexus-mini-app)

A production-ready full-stack template for building scalable applications on Cloudflare Workers. Features a type-safe TypeScript backend using Durable Objects for stateful entities (Users, Chats, Messages), paired with a modern React frontend powered by Vite, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Backend**: Cloudflare Workers with Hono routing, Durable Objects for multi-tenant storage (no external DB needed), indexed entity listing, optimistic concurrency control.
- **Frontend**: React 18, React Router, Tanstack Query for data fetching/caching, shadcn/ui components, Tailwind CSS with custom design system, dark mode support.
- **Shared Types**: TypeScript types shared between frontend and worker for end-to-end type safety.
- **Development**: Hot module replacement (HMR), Bun-powered workflows, automatic type generation from Wrangler.
- **Production**: Optimized builds, CORS handling, error reporting, one-click deployment.
- **Demo Entities**: Users, ChatBoards (with real-time messages) – extend via `worker/entities.ts` and `worker/user-routes.ts`.
- **Responsive**: Mobile-first design with sidebar layout, theme toggle, animations.

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Runtime** | Cloudflare Workers, Durable Objects |
| **Backend** | Hono, TypeScript |
| **Frontend** | React 18, Vite, React Router, Tanstack React Query |
| **UI/UX** | Tailwind CSS, shadcn/ui, Lucide Icons, Framer Motion, Sonner (toasts) |
| **State** | Zustand, Immer, React Hook Form |
| **Utilities** | clsx, tailwind-merge, date-fns, uuid |
| **Dev Tools** | Bun, ESLint, TypeScript 5, Wrangler |
| **Other** | Cloudflare Vite Plugin, error boundaries, API client |

## 📦 Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended package manager)
- [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account (free tier sufficient)

### Installation
```bash
bun install
```

### Development
Start the development server (frontend + worker proxy):
```bash
bun dev
```
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/*
- Hot reload enabled for both.

Generate Worker types:
```bash
bun cf-typegen
```

Lint & format:
```bash
bun lint
```

### Build for Production
```bash
bun build
```
Output in `dist/` – ready for deployment.

## 🔧 Usage

### API Endpoints
Extend routes in `worker/user-routes.ts`. Demo endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (supports `?cursor` & `?limit`) |
| POST | `/api/users` | Create user `{ "name": "..." }` |
| GET | `/api/chats` | List chats |
| POST | `/api/chats` | Create chat `{ "title": "..." }` |
| GET | `/api/chats/:chatId/messages` | Get messages |
| POST | `/api/chats/:chatId/messages` | Send message `{ "userId": "...", "text": "..." }` |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/deleteMany` | Bulk delete `{ "ids": ["..."] }` |

**Example (curl)**:
```bash
# List users
curl http://localhost:3000/api/users

# Create chat
curl -X POST http://localhost:3000/api/chats \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat"}'
```

### Frontend Customization
- Replace `src/pages/HomePage.tsx` with your app.
- Use `src/lib/api-client.ts` for type-safe API calls.
- Components: Full shadcn/ui library available in `src/components/ui/*`.
- Layout: `AppLayout.tsx` for sidebar (optional).
- Hooks: `useTheme`, `useMobile`, error reporting auto-enabled.

### Extending the Backend
1. Add entities in `worker/entities.ts` (extends `IndexedEntity`).
2. Register routes in `worker/user-routes.ts`.
3. Seed data via `static seedData`.
4. `worker/index.ts` auto-loads routes (HMR in dev).

## ☁️ Deployment

Deploy to Cloudflare Workers with one command:

```bash
bun deploy
```

Or manually:
```bash
bun build
wrangler deploy
```

### Setup Cloudflare
```bash
# Login
wrangler login

# Deploy (auto-detects `wrangler.jsonc`)
wrangler deploy
```

**Custom Domain**: Edit `wrangler.jsonc` – supports SPA routing and API proxying.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ArashSv/nexus-mini-app)

### Environment
- Durable Objects auto-migrate via `wrangler.jsonc`.
- No external services needed.
- Global edge network, zero cold starts.

## 🤝 Contributing

1. Fork & clone.
2. `bun install`.
3. `bun dev`.
4. Add features to `worker/user-routes.ts` or frontend.
5. Test APIs, commit, PR.

## 📄 License

MIT – see [LICENSE](LICENSE) (or create one).

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- Questions? Open an issue.

Built with ❤️ for the Cloudflare ecosystem.