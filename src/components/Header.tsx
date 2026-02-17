import { useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
    const { user, signOut } = useAuthContext()
    const [isDyslexiaMode, setIsDyslexiaMode] = useState(() => localStorage.getItem('dyslexia-mode') === '1')
    const navigate = useNavigate()

    const handleDyslexiaToggle = () => {
        document.body.classList.toggle('dyslexia-mode')
        const active = document.body.classList.contains('dyslexia-mode')
        localStorage.setItem('dyslexia-mode', active ? '1' : '0')
        setIsDyslexiaMode(active)
    }

    return (
        <header className="app-header">
            <Link to="/" className="app-header__logo">
                <div className="app-header__logo-icon" />
                <span>Prøve</span>
            </Link>

            <div className="app-header__actions">
                <button
                    className={`btn btn--secondary btn--sm dyslexia-toggle ${isDyslexiaMode ? 'active' : ''}`}
                    onClick={handleDyslexiaToggle}
                    title="Veksle dysleksivennlig skrift"
                    id="dyslexia-toggle"
                    style={{
                        gap: 'var(--space-1)',
                        borderColor: isDyslexiaMode ? 'var(--c-primary)' : 'var(--c-border)',
                        background: isDyslexiaMode ? 'var(--c-primary-glow)' : 'var(--c-surface-elevated)'
                    }}
                >
                    <span style={{ fontSize: '1.2em' }}>Aa</span>
                    <span className="hide-mobile">Dysleksi</span>
                </button>

                {user && (
                    <>
                        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-text-secondary)' }}>
                            {user.displayName}
                        </span>
                        <button
                            className="btn btn--ghost btn--sm"
                            onClick={async () => {
                                await signOut()
                                navigate('/')
                            }}
                            id="logout-btn"
                        >
                            Logg ut
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}
