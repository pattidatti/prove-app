import { useAuthContext } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function TeacherDashboard() {
    const { user } = useAuthContext()

    return (
        <div className="page">
            <div className="dashboard-header">
                <div>
                    <h1>Mine prøver</h1>
                    <p style={{ color: 'var(--c-text-secondary)', marginTop: 'var(--space-1)' }}>
                        Velkommen, {user?.displayName}
                    </p>
                </div>
                <Link to="/laerer/ny" className="btn btn--primary" id="create-exam-btn">
                    + Ny prøve
                </Link>
            </div>

            {/* Placeholder — will be populated in Fase 2 */}
            <div className="empty-state">
                <div className="empty-state__icon">📝</div>
                <h2>Ingen prøver ennå</h2>
                <p>Opprett din første prøve for å komme i gang</p>
                <Link to="/laerer/ny" className="btn btn--primary">
                    Opprett prøve
                </Link>
            </div>
        </div>
    )
}
