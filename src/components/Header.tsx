import { useAuthContext } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
    const { user, signOut } = useAuthContext()
    const navigate = useNavigate()

    const handleDyslexiaToggle = () => {
        document.body.classList.toggle('dyslexia-mode')
        const active = document.body.classList.contains('dyslexia-mode')
        localStorage.setItem('dyslexia-mode', active ? '1' : '0')
    }

    return (
        <header className="app-header">
            <Link to="/" className="app-header__logo">
                <div className="app-header__logo-icon" />
                <span>Prøve</span>
            </Link>

            <div className="app-header__actions">
                <button
                    className="btn btn--ghost btn--sm"
                    onClick={handleDyslexiaToggle}
                    title="Dysleksivennlig skrift"
                    id="dyslexia-toggle"
                >
                    Aa
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
