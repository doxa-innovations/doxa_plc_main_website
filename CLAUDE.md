# CLAUDE.md

Guidance for Claude Code (claude.ai/code) working in this repository.

## What this is

Marketing site, lead-attribution system, and self-hosted CMS for **Doxa Innovations Software Development PLC**. Next.js 16 App Router, React 19, TypeScript, Tailwind **v4**, Payload CMS 3 on Postgres.

> Some npm metadata still carries the older "Bee Design Studio" name. The live domain is `doxaplc.com`.

## Commands

```bash
npm run dev             # dev server (Turbopack)
npm run build           # production build, output: "standalone", for Docker
npm run start           # serve a production build
npm run lint            # eslint
npm run typecheck       # tsc --noEmit

npm run db:up           # local Postgres (5433) + Mailpit (1025, UI on 8025)
npm run db:down

npm run seed:admin      # ADMIN_EMAIL=… ADMIN_PASSWORD=… — add a login by hand
npm run seed:content    # OVERWRITE the database from content/*.ts, discarding Olympus edits
npm run generate:types  # regenerate payload-types.ts after a schema change
npm run migrate:create  # after changing any collection
npm run migrate         # apply migrations
npm run prune:visits    # retention job, DRY_RUN=1 to preview
```

**There is no test suite.** No test runner is configured. Do not claim tests pass. Verify with `npm run typecheck`, `npm run lint`, `npm run build`, and by exercising the app.

## Architecture

### Route groups

`app/layout.tsx` is only the document shell (html, body, fonts, metadata). Chrome lives one level down:

- **`app/(site)/`** — the public site. `app/(site)/layout.tsx` renders the navbar, footer, JSON-LD and cookie banner. Route groups do not appear in URLs.
- **`app/olympus/`** — the admin panel. `(panel)/layout.tsx` is the signed-in shell; `login/` sits outside it so it is not behind its own auth check.
- **`app/not-found.tsx`** renders the navbar and footer itself, because an unmatched URL belongs to no route group and never reaches `(site)`.

### Payload runs headless

There is **no `app/(payload)` directory, and creating one is what would enable Payload's admin UI, REST and GraphQL APIs.** Everything goes through the Local API (`getPayloadClient()` in `lib/payload.ts`). Consequences, all deliberate: no importmap step, no `sharp`, no rich-text editor.

`payload.config.ts` and `collections/` sit at the repo root. `@payload-config` is a tsconfig path alias.

### Content flow

Content lives in Postgres and is read through **`lib/content.ts`**, which returns the interfaces declared in **`content/types.ts`**. Keep that contract: `lib/jsonld.ts` builds structured data from the same objects the pages render, which is what stops visible copy and schema.org output drifting apart.

`content/*.ts` are now **seed data**, not what the site renders. `lib/seed.ts` turns them into database records, and two callers write them:

- **`instrumentation.ts`, on every boot.** Creates only what is missing and never touches an existing document, so a restart cannot revert an edit made in `/olympus`. It also creates the first login from `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME`. The trade-off is that a document *deleted* in `/olympus` comes back on the next boot, because "missing" and "never seeded" are indistinguishable — unpublish instead of deleting, or remove it from `content/`.
- **`npm run seed:content`, by hand.** Overwrites. This is the only way to push a `content/` copy change to an already-seeded site, and it discards `/olympus` edits to the documents it covers.

Seeding is best-effort and never throws: a failed seed logs and the server still starts. That is the opposite of the migration policy directly above it, deliberately — a site missing content beats a container that will not boot.

Not editable, deliberately, and each for a reason documented in `globals/SiteSettings.ts`: `SITE.url`, the registration numbers, `mapEmbedUrl`, and the nav trees.

### Tracking

- `lib/channel.ts` — pure channel classifier. Paid beats owned beats earned; click ids beat UTM tags beat the referrer.
- `lib/attribution.ts` — the daily-rotating salted hash of IP and user agent. **No IP is ever stored.**
- `app/api/t/route.ts` — the visit beacon. Cookieless by default, so it measures people who decline cookies.
- `app/api/consent/route.ts` — consent audit trail, and deletes the visitor cookie on withdrawal.

## Traps that have already cost time

Read these before touching the related area.

1. **`export const dynamic = "force-dynamic"` does NOT stop `generateStaticParams` running.** Next calls it for any route with dynamic segments. A `generateStaticParams` that reads Payload will open a database connection during `next build`, which has no database in Docker, and fail the build. `app/(site)/works/[slug]` therefore has none.

2. **Call `headers()` before opening the Payload connection.** `lib/auth.ts` does this on purpose. The other order makes Next prerender the route and hit the database at build time.

3. **Every authenticated page must call `requireUser()` ITSELF, not rely on the layout.** Layouts and pages render *concurrently*, so an unguarded page runs its queries and renders real data while the layout is still awaiting the check, and Next ships that output as the body of the 307 redirect. This leaked customer names and email addresses to anonymous `curl` until it was fixed.

4. **`updateTag`, not `revalidateTag(tag, "max")`, in the content actions.** "max" is stale-while-revalidate: the first page load after a save still serves the old value. For a CMS that reads as a broken save.

5. **Never call `revalidateTag`/`updateTag` from a Payload hook.** Outside a server action there is no work store, it throws E263, and because `afterChange` errors propagate it aborts the write. It would also fire during migrations and seed scripts.

6. **`csrf` in `payload.config.ts` must list every origin the panel is served from.** Page loads send no `Origin` header and pass; server actions do send one, and a missing origin makes Payload discard the auth cookie, which surfaces only as "not signed in" on save.

7. **Payload's `run` command needs TOP-LEVEL await in scripts.** It does `await import(script)` then `process.exit(0)`, so a floating promise is killed and the script exits 0 having done nothing.

8. **Never point a dev server at the production database.** Dev `push` writes a `batch: -1` row into `payload_migrations`, which makes production `migrate()` open an interactive prompt and hang in a non-TTY container.

9. **The Turnstile widget's hostname list is a single point of failure for the whole contact form.** A hostname that is not on it gets client error `110200` and no token, for every visitor, and the form stops working. Check it before blaming the code. Related: a failed challenge is the ONE bot check in `app/api/contact/route.ts` that answers with a visible error rather than a silent `{ok:true}`. That is deliberate. The honeypot and user-agent checks can never false-positive on a human, so silence costs nothing there; a challenge that could not run is usually a real person with an ad blocker or a misconfigured hostname, and a silent 200 sends them to `/thank-you` while the enquiry is discarded.

## Conventions

- **Path alias:** `@/*` → repo root. There is no `src/`. `_archive/` is the dead legacy app, excluded from tsconfig and eslint; ignore it.
- **Brand colors are fixed, never change these values.** Primary `#7851A9`, Secondary `#b277d3`, Accent `#19003a`, exposed as `pj-primary`, `pj-secondary`, `pj-accent`. Font utility `font-pj-font` (Georama, loaded via `next/font/local`).
- **Tailwind v4, CSS-first.** All theme tokens live in `app/globals.css`. There is no `tailwind.config.ts` in the active tree.
- **The `.light` class** flips the token scope to a white surface. It sets `color: var(--ink)` itself; without that, text inherits the near-white value resolved on `<body>` and becomes invisible on white. This was a real bug on the contact form.
- **`--chart-1..5` are a monochromatic violet ramp.** Fine for single-series charts, but they FAIL categorical-palette validation (adjacent pairs sit below the ΔE 15 floor). Do not use them for a five-category pie or stacked chart.
- **Images** are remote URLs rendered with plain `<img>` in places; `@next/next/no-img-element` is intentionally off. `next/image` is also fine.
- Only `route.ts`, `layout.tsx`, `proxy.ts` and server components are server-side. Interactive components are `"use client"`.
- **`proxy.ts`, not `middleware.ts`.** Next 16 renamed the convention.

## Environment

Copy `.env.example` to `.env`.

- **Database:** `DATABASE_URI`, `PAYLOAD_SECRET`. `PAYLOAD_SECRET` is also required at build time; the Dockerfile passes a throwaway value inline so the real one never enters the image.
- **Email:** `SMTP_*` only. There is no recipient env var: both the customer confirmation's `Reply-To` and the company notification's `To` are `site.email` from the CMS, so the address is changed in `/olympus` and in one place. `CONTACT_NOTIFY_TO` and `CONTACT_TO` are gone; setting them now does nothing. Locally, point SMTP at Mailpit on 1025 so development never sends real mail to a real person.
- **Media:** `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_PUBLIC_URL`. Uploads are disabled when `R2_BUCKET` is unset, so local development works without credentials.
- `FORCE_COUNTRY` previews the Ethiopian view. **Analytics deliberately ignores it** (`countryFromHeaders` vs `getCountryCode` in `lib/geo.ts`), or a value left set in production would mislabel all traffic.

## Deployment

Multi-stage `Dockerfile` on `node:22-alpine`, builds the standalone output, runs `node server.js`. Image pushed to GHCR, deployed with `docker stack deploy`. Postgres is managed by Dokploy.

**The build must always succeed with no database reachable.** That is the acceptance test for any change to data fetching: `docker build .` with Postgres stopped.

Migrations run automatically at container boot via `instrumentation.ts` and `prodMigrations`, followed by seeding (see Content flow). Because `payload.config.ts` imports `migrations/` statically, they are bundled into `.next/standalone` and need no extra `COPY`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
