import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useGrading } from '@/hooks/useGrading'
import { useExams } from '@/hooks/useExams'

export default function ExamSubmissions() {
    const { id } = useParams<{ id: string }>()
    const { exams } = useExams()
    const { sessions, loading, error, subscribeToSessions } = useGrading(id)

    const exam = exams.find(e => e.id === id)

    useEffect(() => {
        if (id) return subscribeToSessions()
    }, [id, subscribeToSessions])

    if (loading) return <div className="page-center"><div className="spinner" /></div>
    if (error) return <div className="page-center"><div className="error-msg">{error}</div></div>

    return (
        <div className="page">
            <div className="dashboard-header">
                <div>
                    <Link to="/laerer" className="back-link">← Tilbake til dashbord</Link>
                    <h1>Besvarelser: {exam?.title || 'Laster...'}</h1>
                    <p style={{ color: 'var(--c-text-muted)' }}>{sessions.length} elever har startet eller levert</p>
                </div>
            </div>

            <div className="card card--static" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="submissions-table">
                    <thead>
                        <tr>
                            <th>Elev</th>
                            <th>Status</th>
                            <th>Startet</th>
                            <th>Levert</th>
                            <th>Resultat</th>
                            <th>Handling</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(s => (
                            <tr key={s.id}>
                                <td><strong>{s.studentName}</strong></td>
                                <td>
                                    <span className={`badge ${s.status === 'active' ? 'badge--neutral' :
                                        s.status === 'submitted' ? 'badge--success' : 'badge--primary'
                                        }`}>
                                        {s.status === 'active' ? 'Jobber...' :
                                            s.status === 'submitted' ? 'Levert' : 'Rettet'}
                                    </span>
                                </td>
                                <td>{s.startedAt?.toLocaleTimeString() || '-'}</td>
                                <td>{s.submittedAt?.toLocaleTimeString() || '-'}</td>
                                <td>{s.grade ? <span className="badge badge--success">{s.grade}</span> : '-'}</td>
                                <td>
                                    <Link to={`/laerer/retting/${id}/${s.id}`} className="btn btn--secondary btn--sm">
                                        {s.status === 'graded' ? 'Se retting' : 'Rett nå'}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {sessions.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                                    Ingen elever har begynt på prøven ennå.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
