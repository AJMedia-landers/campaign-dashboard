# Campaign Dashboard

Next.js 16 (App Router) dashboard sharing the same auth system as `campaign-creation-frontend`.

## Setup

```bash
npm install
npm run dev
```

The app runs at http://localhost:3000 by default.

## Environment

Configured via `.env`:

- `NEXT_PUBLIC_API_BASE` — backend API base URL (e.g. `http://localhost:5000`)
- `NEXT_PUBLIC_SOCKET_URL` — Socket.IO URL (e.g. `ws://localhost:5000`)

## Auth

Same flow as `campaign-creation-frontend`:

- `middleware.ts` — redirects unauthenticated requests to `/signin`
- `(auth)/signin` + `(auth)/signup` — login / register pages
- `api/auth/*` — proxies to backend (`/api/auth/login`, `signup`, `logout`, `profile`, `token`, `change-password`); stores token in httpOnly `token` cookie
- `(app)/layout.tsx` — server-side token check, redirects to `/signin` if missing
- `SocketProvider` — fetches token from `/api/auth/token` on mount and opens authenticated Socket.IO connection
