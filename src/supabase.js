import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const productionOrigin = 'https://accendo.io'

function validateConfig() {
  if (!url || !publishableKey) {
    return 'Supabase is not connected yet. Add the project URL and publishable key to .env.'
  }

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname.endsWith('.supabase.co')) {
      return 'VITE_SUPABASE_URL must be the HTTPS Project URL ending in .supabase.co.'
    }
  } catch {
    return 'VITE_SUPABASE_URL is not a valid web address.'
  }

  if (!publishableKey.startsWith('sb_publishable_') && !publishableKey.startsWith('eyJ')) {
    return 'Use the Supabase publishable key—not a secret key—in the browser app.'
  }

  return ''
}

export const supabaseConfigError = validateConfig()
export const hasSupabaseConfig = !supabaseConfigError

export function getAuthRedirectTo() {
  if (typeof window === 'undefined') return `${productionOrigin}/auth/callback`
  return `${window.location.origin}/auth/callback`
}

export const supabase = hasSupabaseConfig
  ? createClient(url, publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null
