# PVS Dashboard — 2026

## CRITICAL: Git Workflow

- **NEVER push without explicit user approval**
- **NEVER force-push to main** — pushing to `main` triggers production deployment to Netlify
- Commits are fine without approval — just keep them atomic and well-documented
- Follow the branching model: `main` -> `dev/{milestone}` -> `epic/{ticket-id}` or `{ticket-id}`

## CRITICAL: Development Server

- **DO NOT start dev servers** — user typically has one running on port 3000
- If you must start a server: `pnpm dev`
- Always check if port 3000 is in use before starting

## Project Overview

Multi-tenant CMS dashboard for PVS clients. Each client gets a branded dashboard instance resolved by hostname. This is an internal PVS product, not a client site.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui |
| Data Fetching | React Query |
| Rich Text | Tiptap |
| Auth | Supabase Auth |
| Deployment | Netlify |
| Package Manager | pnpm |

## Project Organization

```
src/
├── app/                    # App Router pages and layouts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/             # Shared components (shadcn goes in components/ui)
├── lib/                    # Utilities, API client, helpers
├── hooks/                  # Custom React hooks
├── providers/              # Context providers (auth, branding, query)
└── types/                  # Shared type definitions
```

## Code Style

Prettier and ESLint are configured. Match the PVS server repo conventions:

- **4-space indentation**
- **Single quotes**
- **No semicolons**
- **Trailing commas**
- **100 char print width**

Run `pnpm format` to auto-format and `pnpm lint` to check.

## Implementation Standards

### Layout
- **Container**: `max-w-7xl mx-auto px-6`
- **Section spacing**: `py-16 md:py-24`

### Performance
- Use Next.js Image component with proper sizing
- Use `next/font` for font loading
- Lazy load below-the-fold components

### Security
- Never expose service role keys client-side
- Only `NEXT_PUBLIC_` env vars are safe for the browser
- Validate all user input at API boundaries
- Tenant isolation: always scope queries by tenant/hostname

### Multi-tenancy
- Tenant resolution happens via hostname (`window.location.hostname`)
- Dev override: `NEXT_PUBLIC_DEV_HOSTNAME` in `.env.local`
- All data fetching must be scoped to the resolved tenant

## Core Principles

1. **User Experience** — Clean, intuitive interfaces that clients can navigate without training
2. **Performance** — Fast loads, optimized bundles, minimal client-side JS where possible
3. **Security** — Proper auth, tenant isolation, no data leakage between clients
4. **Multi-tenant Integrity** — Every feature must respect tenant boundaries by design

## Linear Ticket Creation

When creating Linear tickets for this project:

| Field | Value |
|-------|-------|
| Team | Development |
| Assignee | `me` |
| Project | PVS Dashboard/CMS |
| Initiative | PixelVerse Studios |
| Priority | Medium (3) |

**Labels:** Always apply one from each sub-label group:

- **Environment:** `Front End`, `Fullstack`, `Server`
- **Scope:** `Ticket`, `Epic`
- **Task:** `Feature`, `Bug`, `Improvement`, `Refactor`, `Maintenance`, `Research`

**Milestones:** All tickets must have a milestone assigned before work begins. Milestones represent releases and determine the dev branch (`dev/{milestone-slug}`). List milestones via `list_milestones` and ask the user to choose.

## Team

| Name | Role | Ownership |
|------|------|-----------|
| Phil | Lead Dev | Architecture, fullstack, deployment |
| Sami | Designer | UI/UX design, design system |
