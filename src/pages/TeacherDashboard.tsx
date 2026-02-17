import { useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useExams } from '@/hooks/useExams'

export default function TeacherDashboard() {
    const { user } = useAuthContext()
    const { exams, loading, subscribeToExams, updateExam, deleteExam } = useExams()

    useEffect(() => {
        return subscribeToExams()
    }, [subscribeToExams])

    const toggleActivate = async (id: string, current: boolean) => {
        await updateExam(id, { isActive: !current })
    }

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

            {loading ? (
                <div className="page-center" style={{ minHeight: '200px' }}>
                    <div className="spinner" />
                </div>
            ) : exams.length > 0 ? (
                <div className="dashboard-grid">
                    {exams.map((exam) => (
                        <div key={exam.id} className="card exam-card">
                            <div className="exam-card__title">{exam.title}</div>
                            <div className="exam-card__meta">
                                <span>{exam.subject}</span>
                                <span>•</span>
                                <span>{exam.durationMinutes} min</span>
                            </div>

                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <span className={`badge ${exam.isActive ? 'badge--success' : 'badge--neutral'}`}>
                                    {exam.isActive ? 'Aktiv' : 'Utkast'}
                                </span>
                            </div>

                            <div className="exam-card__footer">
                                <div className="exam-card__code" title="Prøvekode">
                                    {exam.accessCode}
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <button
                                        className="btn btn--secondary btn--sm"
                                        onClick={() => toggleActivate(exam.id, exam.isActive)}
                                    >
                                        {exam.isActive ? 'Deaktiver' : 'Aktiver'}
                                    </button>
                                    <Link to={`/laerer/besvarelser/${exam.id}`} className="btn btn--secondary btn--sm">
                                        Besvarelser
                                    </Link>
                                    <Link to={`/laerer/rediger/${exam.id}`} className="btn btn--secondary btn--sm">
                                        Rediger
                                    </Link>
                                    <button
                                        className="btn btn--ghost btn--sm"
                                        style={{ color: 'var(--c-error)' }}
                                        onClick={() => confirm('Er du sikker?') && deleteExam(exam.id)}
                                    >
                                        Slett
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-state__icon">📝</div>
                    <h2>Ingen prøver ennå</h2>
                    <p>Opprett din første prøve for å komme i gang</p>
                    <Link to="/laerer/ny" className="btn btn--primary">
                        Opprett prøve
                    </Link>
                </div>
            )}
        </div>
    )
}
