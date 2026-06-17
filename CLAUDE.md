# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Marketing/portfolio website for **Doxa Innovations Software Development PLC** (the npm package and some metadata still use the older "Bee Design Studio" name). Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v3. Deploys live at `https://beedesign.studio`.

## Commands

```bash
npm run dev      # dev server with Turbopack (http://localhost:3000)
npm run build    # production build (output: "standalone", for Docker)
npm run start     # serve a production build
npm run lint     # next lint (ESLint)
```

There is **no test suite** — no test runner is configured. Don't claim tests pass; there are none to run. Verify changes via `npm run build` and `npm run lint`.

Docker: multi-stage `Dockerfile` builds the Next.js standalone output on `node:18-alpine`, runs `node server.js`, exposes port 3000.

## Architecture

**Every page is wrapped in `src/app/_LayoutOutline.tsx`** (`<LayoutOutline>`) — this `"use client"` component is the real shared page shell. It renders the header (bee/logo/crown-sword icons, the "Go to" nav dropdown, the back arrow), the footer copyright line, the 300ms loading spinner, and the animated blob background (`LiveBGStatic`). All seven routes (`/`, `about`, `contact`, `prices`, `services`, `team`, `works`) wrap their content in it and configure it via props: `title`, `description`, `backLink` (string href, or `null` to hide the back arrow and show the crown-sword icon instead), `logoShow`, `lgLogoShow`. To change global chrome (nav links, header, footer), edit `_LayoutOutline.tsx`, not the individual pages.

**`src/Context/LayoutContext.tsx` is dead code.** `LayoutProvider`/`useLayout` are defined but imported nowhere — the layout state actually flows through `_LayoutOutline` props described above. Don't wire new work through this context expecting it to do anything.

**`src/app/layout.tsx`** is the root layout: it loads the local Georama font (`src/app/fonts/*.ttf` via `next/font/local`), defines all SEO `metadata` (OpenGraph, Twitter, keyword list), and preloads CDN images. Page-level `<title>`/icons live here.

**Contact form is the only backend.** `src/app/contact/page.tsx` posts the form via `axios` to `POST /api/contact` (`src/app/api/contact/route.ts`), which sends an email through **nodemailer/SMTP** to `doxainnovationsplc@gmail.com`. Requires the SMTP env vars below. The UI surfaces success/error through a `<dialog id="notify-dialog">` toggled imperatively via `document.getElementById`.

**`src/FileDatabase.json`** is the portfolio data source: an array of project objects (`title`, `image`, `tag`, `link`, `clamp`, `filled`, `details{subTitle, description, techStack[], image}`). Consumed only by `src/app/works/page.tsx`, which lays projects out in a hex grid and pads to 10 cells. Add a project here, not in JSX.

## Conventions

- **Path alias:** `@/*` → `./src/*` (e.g. `@/app/_LayoutOutline`, `@/Components/LiveBG`).
- **Brand colors are fixed — never change these values.** Primary is **always** `#7851A9`, Secondary is **always** `#b277d3`, Accent is **always** `#19003a`. They are exposed as the Tailwind tokens `pj-primary`, `pj-secondary`, `pj-accent` in `tailwind.config.ts` (alongside `pj-dark` `#1E1E1E` and `pj-white` `#ECECEC`). Always reference the `pj-*` tokens rather than hardcoding hex, and don't alter the hex values behind them. The font utility is `font-pj-font` (Georama).
- **Images:** most assets are remote, served from `https://cdn.doxaplc.com/doxa-public/...`, and rendered with plain `<img>` — the `@next/next/no-img-element` ESLint rule is intentionally **off** (`eslint.config.mjs`). `next/image` is used in a few components (`StatCard`, parts of `works`); either is acceptable.
- Interactive pages/components are `"use client"`. Only `route.ts` and `layout.tsx` are server-side.

## Environment

Copy `.env.example` to `.env`. The contact route reads `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` (and `DOMAIN`). Without valid SMTP credentials, contact-form submissions return a 500 and the UI shows the "Server Error" dialog.
