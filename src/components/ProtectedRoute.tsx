import { useAuthContext } from '@/contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
    children: ReactNode
    role?: 'teacher' | 'student'
}

export default function ProtectedRoute({ children, role }: Props) {
    const { user, loading } = useAuthContext()
    const location = useLocation()

    if (loading) {
        return (
            <div className="page-center">
                <div className="spinner" />
            </div>
        )
    }

    if (!user) {
        const redirect = role === 'student' ? '/elev' : '/laerer/login'
        return <Navigate to={redirect} state={{ from: location }} replace />
    }

    if (role && user.role !== role) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
