import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'

export default function TeacherLogin() {
    const { signInTeacher, registerTeacher, signInWithGoogle, error, loading } = useAuthContext()
    const navigate = useNavigate()

    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (mode === 'login') {
            await signInTeacher(email, password)
        } else {
            await registerTeacher(email, password, name)
        }
        // Auth state change will trigger onAuthStateChanged → navigation
        navigate('/laerer')
    }

    return (
        <div className="page-center">
            <div className="card card--static auth-card">
                <h1>{mode === 'login' ? 'Logg inn' : 'Registrer deg'}</h1>
                <p>{mode === 'login' ? 'Logg inn med lærerkontoen din' : 'Opprett en ny lærerkonto'}</p>

                {error && <div className="error-msg">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="input-group">
                            <label htmlFor="teacher-name">Navn</label>
                            <input
                                id="teacher-name"
                                className="input"
                                type="text"
                                placeholder="Ditt navn"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="teacher-email">E-post</label>
                        <input
                            id="teacher-email"
                            className="input"
                            type="email"
                            placeholder="laerer@skole.no"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="teacher-password">Passord</label>
                        <input
                            id="teacher-password"
                            className="input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button className="btn btn--primary btn--lg" type="submit" disabled={loading} id="teacher-submit">
                        {loading ? <div className="spinner" /> : mode === 'login' ? 'Logg inn' : 'Registrer'}
                    </button>
                </form>

                <div className="auth-divider">eller</div>

                <button
                    className="btn btn--secondary"
                    onClick={() => signInWithGoogle().then(() => navigate('/laerer'))}
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', marginBottom: 'var(--space-4)' }}
                    id="google-login-btn"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            style={{ fill: '#4285F4' }}
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            style={{ fill: '#34A853' }}
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            style={{ fill: '#FBBC05' }}
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            style={{ fill: '#EA4335' }}
                        />
                    </svg>
                    Logg inn med Google
                </button>

                <button
                    className="btn btn--ghost"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    style={{ width: '100%', justifyContent: 'center' }}
                    id="toggle-auth-mode"
                >
                    {mode === 'login' ? 'Opprett ny konto' : 'Har allerede en konto'}
                </button>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                    <Link to="/" style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>
                        ← Tilbake
                    </Link>
                </div>
            </div>
        </div>
    )
}
