# PVS Dashboard

Multi-tenant CMS dashboard for PVS clients.

## Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Data Fetching**: React Query
- **Rich Text**: Tiptap
- **Auth**: Supabase Auth
- **Deployment**: Netlify

## Local Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The project deploys to Netlify via the `@netlify/plugin-nextjs` runtime plugin. See `netlify.toml` for the build configuration.
