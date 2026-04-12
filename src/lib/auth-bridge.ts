// Bridges Supabase auth into the API client's token injection.
// Import this module once from a client-only provider (e.g., AuthProvider).
// Do NOT import from Server Components or at module top-level in layout.tsx.

import { setTokenGetter } from '@/lib/api-client'
import { getAccessToken } from '@/lib/auth-service'

setTokenGetter(getAccessToken)
