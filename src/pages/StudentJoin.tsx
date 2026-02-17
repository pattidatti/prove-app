import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '@/contexts/AuthContext'

export default function StudentJoin() {
    const { signInStudent, error, loading } = useAuthContext()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [accessCode, setAccessCode] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await signInStudent(name)
        // Navigate to the exam with the access code
        navigate(`/prove/${accessCode}`)
    }

    return (
        <div className="page-center">
            <div className="card card--static auth-card">
                <h1>Bli med på prøve</h1>
                <p>Skriv inn navnet ditt og koden du fikk fra læreren</p>

                {error && <div className="error-msg">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="student-name">Fornavn</label>
                        <input
                            id="student-name"
                            className="input"
                            type="text"
                            placeholder="Ditt fornavn"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="access-code">Prøvekode</label>
                        <input
                            id="access-code"
                            className="input"
                            type="text"
                            placeholder="F.eks. ABC123"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                            required
                            maxLength={8}
                            style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', textTransform: 'uppercase' }}
                        />
                    </div>

                    <button className="btn btn--primary btn--lg" type="submit" disabled={loading || !name || !accessCode} id="student-submit">
                        {loading ? <div className="spinner" /> : 'Start prøve'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
                    <Link to="/" style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-muted)' }}>
                        ← Tilbake
                    </Link>
                </div>
            </div>
        </div>
    )
}
