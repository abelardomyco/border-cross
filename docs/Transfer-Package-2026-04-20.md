# Border Crossing Dashboard — Transfer Package (2026-04-20)

Goal: export a complete, transferable version of `border-crossing-dashboard/` so it can be opened and continued in another Cursor account/environment with minimal setup friction.

---

## A) Directory tree (runtime-critical vs optional)

### Runtime-critical (must keep)

```
border-crossing-dashboard/
  app/
    api/
      admin/upload/route.ts
      analytics/route.ts
      live/route.ts
      ports/[slug]/route.ts
    admin/page.tsx
    analytics/page.tsx
    ports/[slug]/{page.tsx,PortPageClient.tsx,not-found.tsx}
    quick-check/page.tsx
    {layout.tsx,page.tsx,globals.css,favicon.ico}
    fonts/{GeistVF.woff,GeistMonoVF.woff}
  components/
    modules/ (dashboard modules)
    overview/RegionalBoard.tsx
    ports/PortModuleGrid.tsx
    shell/{AppShell.tsx,RefreshBadge.tsx}
  data/
    mock/ports-seed.json
    templates/us-mx-port-page.template.json
  hooks/useDashboardRefresh.ts
  lib/
    integrations/sourceAdapters.notes.ts
    mock/mockLiveBuilder.ts
    prediction/{index.ts,mockFormulas.ts,types.ts}
    types/domain.ts
  public/mock-media/camera.svg
  docs/
    Full-Update-All-Three-Sites-2026-04-20.md
    Transfer-Package-2026-04-20.md
  package.json
  package-lock.json
  tsconfig.json
  tailwind.config.ts
  postcss.config.mjs
  next.config.mjs
  .eslintrc.json
  .gitignore
  .env.example
```

### Optional (do not include in export ZIP / do not commit)

- `node_modules/` (reinstall via `npm install` or `npm ci`)
- `.next/` (Next.js build artifacts; can be corrupted; always regenerate)
- `out/`, `coverage/`, `npm-debug.log*`, etc.

---

## B) Dependency summary (versions + runtime requirements)

### Node / runtime

- **Node.js**: **18.17+** (Next.js 14 requirement; recommended Node 20+)
- **npm**: use the lockfile (`package-lock.json`) for reproducible installs

### Dependencies (from `package.json`)

- **next**: `14.2.35`
- **react**: `^18`
- **react-dom**: `^18`

### Dev dependencies (from `package.json`)

- **typescript**: `^5`
- **@types/node**: `^20`
- **@types/react**: `^18`
- **@types/react-dom**: `^18`
- **postcss**: `^8`
- **tailwindcss**: `^3.4.1`
- **eslint**: `^8`
- **eslint-config-next**: `14.2.35`

### Notes on “implicit” requirements

- No Python / requirements.txt, no Docker, no database required for the current mock build.
- Production ingestion/historical analytics will eventually need **storage + database** (see `.env.example`).

---

## C) Environment variables

### Variables referenced by code

- **None currently**. The app runs entirely on mock data builders in `lib/mock/mockLiveBuilder.ts`.

### `.env.example`

Use `.env.example` as a placeholder map for future integrations (do not commit real secrets).

---

## D) Setup instructions (new machine)

From a fresh clone:

```bash
cd border-crossing-dashboard
npm ci
npm run dev
```

Open `http://localhost:3007`.

Production-like run:

```bash
npm run build
npm run start
```

---

## E) Data + assets audit

### Static data (must keep)

- `data/mock/ports-seed.json` (initial ports + layout variants + base waits)
- `data/templates/us-mx-port-page.template.json` (template for adding new ports)

### Static assets (must keep)

- `public/mock-media/camera.svg` (camera placeholder)
- `app/fonts/*` (Geist fonts used by `app/layout.tsx`)
- `app/favicon.ico`

### Path correctness

- All assets are referenced via **root-relative** URLs (e.g. `/mock-media/camera.svg`), which works in Next.js.

---

## F) API + external services (mock vs real)

### API routes (currently mocked)

- `GET /api/live` → regional overview rollup (mock)
- `GET /api/ports/[slug]` → full `PortSnapshot` (mock)
- `GET /api/analytics?slug=...` → mock historical series
- `POST /api/admin/upload` → mock ingest mapping (returns metadata; future: store file + enqueue CV)

### Integrations you’ll likely plug in later

- **Official waits (CBP)**: see `lib/integrations/sourceAdapters.notes.ts`
- **Approach congestion (Google Routes / Directions)**: same
- **Camera + screenshots as evidence**: admin upload route + camera module
- **Video AI flow/discharge analysis**: `VideoFlowSegment` + `VideoFlowAnalysisPanel`
- **Prediction**: `lib/prediction/*` is explicitly an interface with a mock implementation

---

## G) Export package plan (ready-to-zip)

### Include

- All runtime-critical files listed in section A
- `package-lock.json`
- `.env.example`
- `docs/Transfer-Package-2026-04-20.md`

### Exclude

- `node_modules/`
- `.next/`
- `out/`, `coverage/`
- OS/editor temp files

### “Ready-to-zip” structure (expected)

```
border-crossing-dashboard/
  app/
  components/
  data/
  docs/
  hooks/
  lib/
  public/
  .env.example
  .eslintrc.json
  .gitignore
  next.config.mjs
  package.json
  package-lock.json
  postcss.config.mjs
  tailwind.config.ts
  tsconfig.json
  README.md
```

---

## H) GitHub handoff checklist (recommended)

1. Ensure `.gitignore` excludes `node_modules/` and `.next/` (it does).
2. Commit the project changes.
3. Create a GitHub repo (private recommended) and push.
4. In the other Cursor account:
   - Clone repo
   - `cd border-crossing-dashboard`
   - `npm ci`
   - `npm run dev`

