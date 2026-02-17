import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { AppUser } from '@/types/exam'
import type { User } from 'firebase/auth'

interface AuthContextType {
    user: AppUser | null
    firebaseUser: User | null
    loading: boolean
    error: string | null
    signInTeacher: (email: string, password: string) => Promise<void>
    registerTeacher: (email: string, password: string, name: string) => Promise<void>
    signInStudent: (name: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth()
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
    return ctx
}
