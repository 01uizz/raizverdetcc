import { supabase } from '@/lib/supabase'

/**
 * Login por e-mail/senha.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/**
 * Cadastro de usuário.
 * `meta` é o objeto de metadados (nome, telefone...). O TIPO é forçado para
 * 'doador' aqui — promoção a admin acontece SOMENTE no banco (ver supabase/schema.sql).
 * Isso fecha a brecha de escalonamento de privilégio que existia ao permitir
 * escolher "admin" na tela de cadastro.
 */
export async function signUp(email, password, meta = {}) {
  const safeMeta = { ...meta, tipo: 'doador' }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: safeMeta },
  })
  if (error) throw error
  return data
}

/**
 * Envia e-mail de redefinição de senha.
 */
export async function resetPassword(email) {
  const redirectTo =
    typeof window !== 'undefined'
      ? `${window.location.origin}/redefinir-senha`
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/redefinir-senha`

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
