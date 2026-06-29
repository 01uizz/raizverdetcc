import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** true quando as variáveis de ambiente do Supabase estão preenchidas. */
export const isSupabaseConfigured = Boolean(url && anonKey && url.startsWith('http'))

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  // Aviso único e claro no console, em vez de a aplicação quebrar.
  console.warn(
    '[Supabase] Variáveis de ambiente ausentes ou inválidas. ' +
    'Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local ' +
    'e reinicie o servidor (npm run dev).'
  )
}

// Usa valores de fallback inofensivos para não lançar erro na inicialização.
// (Se a URL real estiver errada/fora do ar, as chamadas falham e a UI mostra
//  estados de erro/vazio — veja ErrorState/EmptyState.)
export const supabase = createBrowserClient(
  url ?? 'https://placeholder.supabase.co',
  anonKey ?? 'placeholder-anon-key'
)
