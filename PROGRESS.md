# Production Agent — Build Progress

## 1. Project Setup

- Fastify + TypeScript
- ESLint + Prettier
- Path aliases (`@src/*`)
- `dotenv/config` in `app.ts` entry point

## 2. Docker + PostgreSQL

- `docker-compose.yml` with PostgreSQL 16
- Health check, named volume, isolated network
- `.env` with DB credentials + `DATABASE_URL`

## 3. Drizzle ORM

- Installed `drizzle-orm`, `pg`, `drizzle-kit`
- `src/db/index.ts` — connection pool singleton
- `src/db/schema/` — typed schema files
- `drizzle.config.ts` — points to schema + migrations folder
- `src/db/migrate.ts` — programmatic migration script (fixes Windows .env issue)
- Scripts: `db:generate`, `db:migrate`, `db:studio`, `db:push`

## 4. Database Schema

- `user` — Better Auth managed users
- `session` — Better Auth auth sessions
- `account` — OAuth / email-password accounts
- `verification` — email verification tokens
- `sessions` — conversation history (JSONB messages per user)
- `approvals` — tool approval records (pending / approved)

## 5. Better Auth

- Installed `better-auth`
- `src/lib/auth.ts` — central config with Drizzle adapter
- Email + password enabled
- Session: 7 day expiry, 1 day rotation, 5 min cookie cache
- `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL` in `.env`

## 6. Auth Routes

- Mounted at `/api/auth/*`
- Better Auth handles internally:
    - `POST /api/auth/sign-up/email`
    - `POST /api/auth/sign-in/email`
    - `POST /api/auth/sign-out`
    - `GET  /api/auth/session`

## 7. Auth Middleware

- `src/plugins/auth.plugin.ts` — `app.authenticate` preHandler
- Verifies session on every protected route
- Populates `request.user` and `request.session`
- `src/types/fastify.d.ts` — typed augmentation for request

## 8. CORS

- `@fastify/cors` — explicit allowed origins only (no `*`)
- `credentials: true` for cookie support

## 9. Rate Limiting

- `@fastify/rate-limit` — global: false (opt-in per route)
- Auth routes: max 10 requests / 1 minute per IP

## 10. Protected Agent Routes

- `preHandler: app.authenticate` on `/agent/query`
- `sessionId` removed from request body
- Conversation history keyed by `request.user.id`

---

## What's Next

- [ ] RAG — pgvector, document upload, embeddings
- [ ] Audit log — login, logout, failed attempts
- [ ] Role / ownership checks
- [ ] Production CORS origins
- [ ] PgBouncer connection pooling
