'use client'
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  nome?: string
  tipo?: string
  created_at?: string
  [key: string]: unknown
}

interface AuthValue {
  session: Session | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  isDonor: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthValue>({
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isDonor: false,
  signOut: async () => {},
  refreshProfile: async () => {},
})

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) {
    console.warn('[AuthContext] perfil:', error.message)
    return null
  }
  return data
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  // Guarda o id do usuário cujo perfil já está carregado, para evitar
  // recarregar o perfil em eventos que não mudam o usuário (ex.: TOKEN_REFRESHED).
  const loadedUserId = useRef<string | null>(null)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      const s = data.session
      setSession(s)
      if (s?.user) {
        loadedUserId.current = s.user.id
        const p = await fetchProfile(s.user.id)
        if (mounted) setProfile(p)
      }
      if (mounted) setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!mounted) return
      setSession(s)
      if (s?.user) {
        // Só busca o perfil de novo se o usuário realmente mudou.
        if (loadedUserId.current !== s.user.id) {
          loadedUserId.current = s.user.id
          const p = await fetchProfile(s.user.id)
          if (mounted) setProfile(p)
        }
      } else {
        loadedUserId.current = null
        setProfile(null)
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      const p = await fetchProfile(session.user.id)
      setProfile(p)
    }
  }, [session])

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        // Convenção única em todo o projeto: tipo === 'doador' | 'admin'
        isAdmin: profile?.tipo === 'admin',
        isDonor: profile?.tipo === 'doador',
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
