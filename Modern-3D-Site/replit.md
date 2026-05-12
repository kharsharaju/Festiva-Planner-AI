# Festiva Planner AI

A premium AI-powered event planner web app with a 3D animated hero. Users describe their event (wedding, corporate, party, etc.), set a budget, guest count, duration and city — the AI generates a full plan: budget allocation, vendor list, timeline, and personalized advice.

## Architecture

Pnpm monorepo with three artifacts:

- **`artifacts/festiva-planner`** — React + Vite frontend (path `/`, port 19114).
  - Stack: React, Vite, TanStack Query, wouter, react-hook-form + zod, shadcn/ui, framer-motion, Recharts, Three.js (`@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`).
  - `src/pages/Home.tsx` is the single-page experience: glass navbar, 3D animated hero, features grid, plan generator form, animated AI loading state, results view (event card, budget pie chart, vertical timeline, vendor tabs, AI advice), saved plans showcase, stats strip, footer.
  - `src/components/SafeCanvas.tsx` feature-tests WebGL and renders a gradient fallback if unavailable.
- **`artifacts/api-server`** — Express + Drizzle backend (path `/api`, port 8080).
  - `src/routes/plans.ts` exposes `POST /plan-event` (calls OpenAI), `GET/POST /plans`, `GET /plans/:id`, `GET /stats`.
  - Uses `@workspace/integrations-openai-ai-server` for the Replit OpenAI proxy.
- **`artifacts/mockup-sandbox`** — design canvas (default scaffold, unused).

## Shared libraries

- `lib/api-spec/openapi.yaml` — single source of truth for the REST API.
- `lib/api-client-react` — Orval-generated React Query hooks (`usePlanEvent`, `useSavePlan`, `useListPlans`, `useGetPlan`, `useGetStats`).
- `lib/api-zod` — Orval-generated Zod schemas. The codegen script overwrites `src/index.ts` to re-export only the generated Zod schemas (avoids name collisions with TS interfaces in `api-client-react`).
- `lib/db` — Drizzle schema. `plansTable`: id, eventType, eventTitle, city, budget, guests, plan (jsonb), createdAt.
- `lib/integrations-openai-ai-server` — Replit OpenAI proxy client. Patched to use named `AbortError` import from `p-retry`, optional-chained `response.data` in image client, and added `@types/node` devDep.

## Codegen

```
pnpm --filter @workspace/api-spec run codegen
```

Runs `orval`, then overwrites `lib/api-zod/src/index.ts`, then runs `pnpm -w typecheck:libs`.

## Database

Provisioned PostgreSQL. Schema applied via `pnpm db:push`.

## Environment

- `DATABASE_URL` — PostgreSQL.
- `AI_INTEGRATIONS_OPENAI_BASE_URL`, `AI_INTEGRATIONS_OPENAI_API_KEY` — Replit OpenAI proxy.
- `SESSION_SECRET` — present, unused.

## Notable decisions

- The plan-event route validates the AI's JSON output, then re-stamps `budget`, `guests`, `duration`, `city` from the request and recomputes `percent` for `budgetAllocation` to guarantee internal consistency.
- The 3D hero is wrapped in `<SafeCanvas>` so headless or WebGL-less browsers see a gradient instead of a runtime error.
- All shadcn/ui components are present in `src/components/ui`.
