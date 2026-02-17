import { Link } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'

export default function Home() {
    const { user } = useAuthContext()

    return (
        <div className="page-center">
            <div style={{ textAlign: 'center', maxWidth: '560px' }}>
                <div
                    style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, var(--c-primary) 0%, var(--c-accent) 100%)',
                        borderRadius: 'var(--radius-lg)',
                        margin: '0 auto var(--space-6)',
                        boxShadow: '0 8px 32px rgba(124, 92, 252, 0.3)',
                    }}
                />

                <h1
                    style={{
                        fontSize: 'var(--fs-4xl)',
                        fontWeight: 'var(--fw-bold)',
                        marginBottom: 'var(--space-4)',
                        background: 'linear-gradient(135deg, var(--c-text) 0%, var(--c-primary-text) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Prøve
                </h1>

                <p style={{ color: 'var(--c-text-secondary)', marginBottom: 'var(--space-10)', fontSize: 'var(--fs-lg)', lineHeight: 'var(--lh-relaxed)' }}>
                    Digital prøveplattform med AI-retting og umiddelbar tilbakemelding.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
                    {user?.role === 'teacher' ? (
                        <Link to="/laerer" className="btn btn--primary btn--lg" id="go-dashboard">
                            Gå til dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/laerer/login" className="btn btn--primary btn--lg" id="teacher-login-link">
                                Jeg er lærer
                            </Link>
                            <Link to="/elev" className="btn btn--secondary btn--lg" id="student-join-link">
                                Jeg er elev
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
