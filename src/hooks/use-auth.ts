import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'
import type { User } from '@supabase/supabase-js'

interface AuthStore {
  user: User | null
  profile: Profile | null
  loading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  isAdmin: () => boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, phone: string) => Promise<{ error: any }>
  signOut: () => Promise<{ error: any }>
}

export const useAuth = create<AuthStore>((set, get) => {
  const supabase = createClient()
  return {
    user: null,
    profile: null,
    loading: true,
    setUser: (user) => set({ user }),
    setProfile: (profile) => set({ profile }),
    setLoading: (loading) => set({ loading }),
    isAdmin: () => {
      const profile = get().profile
      return profile?.role === 'admin'
    },
    signIn: async (email, password) => {
      set({ loading: true })
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (!error && data.user) {
        set({ user: data.user })
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        if (profile) set({ profile: profile as Profile })
      }
      set({ loading: false })
      return { error }
    },
    signUp: async (email, password, fullName, phone) => {
      set({ loading: true })
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          },
        },
      })
      set({ loading: false })
      return { error }
    },
    signOut: async () => {
      set({ loading: true })
      const { error } = await supabase.auth.signOut()
      if (!error) {
        set({ user: null, profile: null })
      }
      set({ loading: false })
      return { error }
    }
  }
})
