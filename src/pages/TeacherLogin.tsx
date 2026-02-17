import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'

export default function TeacherLogin() {
    const { signInTeacher, registerTeacher, error, loading } = useAuthContext()
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
