import { useState, useEffect, useCallback } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInAnonymously,
    signOut as firebaseSignOut,
    updateProfile,
    type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import type { AppUser, UserRole } from '@/types/exam'

interface AuthState {
    user: AppUser | null
    firebaseUser: User | null
    loading: boolean
    error: string | null
}

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        firebaseUser: null,
        loading: true,
        error: null,
    })

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (fbUser) => {
            if (fbUser) {
                const role: UserRole = fbUser.isAnonymous ? 'student' : 'teacher'
                setState({
                    user: {
                        uid: fbUser.uid,
                        role,
                        displayName: fbUser.displayName || 'Elev',
                        email: fbUser.email || undefined,
                    },
                    firebaseUser: fbUser,
                    loading: false,
                    error: null,
                })
            } else {
                setState({ user: null, firebaseUser: null, loading: false, error: null })
            }
        })
        return unsub
    }, [])

    const signInTeacher = useCallback(async (email: string, password: string) => {
        setState((s) => ({ ...s, loading: true, error: null }))
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            setState((s) => ({
                ...s,
                loading: false,
                error: err instanceof Error ? err.message : 'Innlogging feilet',
            }))
        }
    }, [])

    const registerTeacher = useCallback(async (email: string, password: string, name: string) => {
        setState((s) => ({ ...s, loading: true, error: null }))
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(cred.user, { displayName: name })
            // Trigger re-read so displayName is picked up
            setState((s) => ({
                ...s,
                user: s.user ? { ...s.user, displayName: name } : null,
            }))
        } catch (err) {
            setState((s) => ({
                ...s,
                loading: false,
                error: err instanceof Error ? err.message : 'Registrering feilet',
            }))
        }
    }, [])

    const signInStudent = useCallback(async (name: string) => {
        setState((s) => ({ ...s, loading: true, error: null }))
        try {
            const cred = await signInAnonymously(auth)
            await updateProfile(cred.user, { displayName: name })
            setState((s) => ({
                ...s,
                user: s.user ? { ...s.user, displayName: name } : null,
            }))
        } catch (err) {
            setState((s) => ({
                ...s,
                loading: false,
                error: err instanceof Error ? err.message : 'Innlogging feilet',
            }))
        }
    }, [])

    const signOut = useCallback(async () => {
        await firebaseSignOut(auth)
    }, [])

    return {
        ...state,
        signInTeacher,
        registerTeacher,
        signInStudent,
        signOut,
    }
}
