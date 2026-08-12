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

One exception to "the nav trees": the footer's **Services** column is built from the services that have `showInFooter` ticked, so renaming a service follows through. `SITE.footerNav.services` is now only the fallback used when the database returns nothing.

**Services are a fixed set of six.** The collection refuses `create` and `delete`, `saveService` refuses to run without an id, and `/olympus/content/services` has no add button, no delete icons and no drag handles. That is because `slug` chooses the hand-drawn illustration in `ServiceArt`, is the `/services#…` anchor every link points at, and pairs with an `icon` name `components/Icon.tsx` has to map. Adding a seventh service means editing `content/services.ts`, `ServiceArt` and `Icon.tsx` together.

A testimonial's `role` ("CEO at Three Roots International") is required and is what the card shows under the name. It replaced a `location` field, because where someone lives says nothing about whether their opinion carries weight.

**Testimonials have no production seed, deliberately.** `content/testimonials.ts` exports `DEV_TESTIMONIALS`, which `lib/seed.ts` writes ONLY when `NODE_ENV !== "production"` (the standalone `server.js` always sets it, so a container never seeds them). Every person in that list is invented, and none of it is attributed to a real client. Real quotes are entered in `/olympus`; the home page hides the whole band while there are none, so an empty production database is the correct state and not a bug to fix by inventing content.

### Two forms, one pipeline

`components/ContactForm.tsx` (the contact page) and `components/marketing/LeadWizard.tsx` (the home page, after the office video) are different SHAPES of the same submission. Both validate against `contactSchema`, POST to `/api/contact`, carry the same honeypot and Turnstile token, write the same Leads row and end on `/thank-you`. Change the field set in `lib/validation.ts` and both follow; do not give the wizard its own endpoint or its own schema.

The wizard mounts `TurnstileWidget` only on its last step, so scrolling past the home page does not pull Cloudflare's script for every visitor. Trap 9 still applies to it — the widget's hostname list gates both forms.

### Tracking

- `lib/channel.ts` — pure channel classifier. Paid beats owned beats earned; click ids beat UTM tags beat the referrer.
- `lib/attribution.ts` — the daily-rotating salted hash of IP and user agent. **No IP is ever stored.**
- `app/api/t/route.ts` — the visit beacon. Cookieless by default, so it measures people who decline cookies.
- `app/api/consent/route.ts` — consent audit trail, and deletes the visitor cookie on withdrawal.
- `lib/consent-mode.ts` — Google Consent Mode v2. Exports a script SOURCE as well as a function, because the all-denied default has to reach the dataLayer before the tag manager container loads. `app/layout.tsx` renders it as a raw inline `<script>` in the head; `next/script` cannot promise that ordering. It also reads the consent cookie synchronously, so a returning visitor is not stuck in the denied default until React hydrates. `SIGNAL_SOURCE` is the single source of truth both the inline script and the runtime path derive from — do not hand-write the signal list in either.
- `lib/gtm.ts` — `trackLead()` pushes `generate_lead` from BOTH forms on a successful POST, never from `/thank-you`. That page is a plain URL anyone can open, reload or share, so a pageview-triggered conversion would report inflated numbers and ad bidding would optimise against them. The event deliberately carries no personal data.
- `components/analytics/GoogleTagManager.tsx` — mounted in `(site)`, not the root layout, so /olympus staff sessions are not measured. Renders nothing unless `GTM_CONTAINER_ID` is set.

**GA4 and Microsoft Clarity are configured INSIDE the container, not in this repo.** Two consequences worth knowing before you touch either:

- **Consent Mode is a Google-only protocol.** GA4 and Google Ads read the signals `lib/consent-mode.ts` pushes and hold themselves back. Clarity does not, and will record every visitor including those who declined, unless its tag carries GTM's **Additional Consent Checks** requiring `analytics_storage`. That checkbox is the entire gate, it lives in a web UI with no code review, and nothing in this repo can enforce it.
- **The privacy policy names the vendors.** `app/(site)/privacy/page.tsx` lists Google and Microsoft, and describes session recording specifically. Publishing a tag that collects something new makes that page wrong, and needs a `CONSENT_POLICY_VERSION` bump in `lib/consent.ts` — which re-asks every visitor, by design.

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

10. **A Tailwind arbitrary value that Tailwind cannot parse fails SILENTLY, as no rule at all.** Two real bugs from this in one component: `[mask-image:…calc(100%-6rem)…]` emitted invalid CSS (Tailwind converts underscores to spaces, nothing else, and `calc` needs whitespace around the minus), so the edge fade never existed and the cards were sliced flat; and `w-[min(88vw,34rem)]` generated nothing, so the card stretched to its container. Neither produces a warning. For anything with `calc()`, `min()` or a comma, use an inline `style` or plain utilities (`w-full max-w-[34rem]`) and verify the COMPUTED style in the browser, not the class list.

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
- **Google Tag Manager:** `GTM_CONTAINER_ID` only. Unset means nothing Google-owned is requested at all, which is the correct state until someone is actually running ads. GA4, Ads conversions and everything else are configured inside the container, not in this repo. Note the missing `NEXT_PUBLIC_` prefix, for the same reason `TURNSTILE_SITE_KEY` lacks one: that prefix resolves at BUILD time and the Docker build has no environment variables, so the id would compile to an empty string. It is read at request time by a server component instead, which is safe because every `(site)` route is dynamic.
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
