'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  nome?: string
  tipo?: string
  created_at?: string
  [key: string]: unknown
}

interface AuthValue {
  session: unknown
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
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return
      const s = data.session
      setSession(s)
      if (s?.user) {
        const p = await fetchProfile(s.user.id)
        if (mounted) setProfile(p)
      }
      if (mounted) setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (!mounted) return
      setSession(s)
      if (s?.user) {
        const p = await fetchProfile(s.user.id)
        if (mounted) setProfile(p)
      } else {
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
