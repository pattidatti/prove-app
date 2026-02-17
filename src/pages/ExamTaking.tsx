import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useExamSession } from '@/hooks/useExamSession'
import { useQuestions } from '@/hooks/useQuestions'
import { useAuthContext } from '@/contexts/AuthContext'

export default function ExamTaking() {
    const { code } = useParams<{ code: string }>()
    const navigate = useNavigate()
    const { user } = useAuthContext()
    const { exam, session, joinExam, saveAnswer, submitExam, answers, loading, error } = useExamSession()
    const { questions, subscribeToQuestions } = useQuestions(exam?.id)

    const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({})
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
    const [submitting, setSubmitting] = useState(false)

    // 1. Join exam on mount
    useEffect(() => {
        if (code && user) {
            joinExam(code, user.displayName)
        }
    }, [code, user])

    useEffect(() => {
        if (session?.status === 'submitted' || session?.status === 'graded') {
            navigate(`/prove/${code}/result`)
        }
    }, [session?.status, code, navigate])

    // 2. Subscribe to questions once exam is loaded
    useEffect(() => {
        if (exam?.id) return subscribeToQuestions()
    }, [exam?.id, subscribeToQuestions])

    // 3. Sync local answers with Firestore answers
    useEffect(() => {
        setLocalAnswers(answers)
    }, [answers])

    // 4. Debounced save logic via Effect
    useEffect(() => {
        const lastChangedQId = Object.keys(localAnswers).find(id => localAnswers[id] !== answers[id])
        if (!lastChangedQId || !session?.id) return

        setSaveStatus('saving')
        const timer = setTimeout(async () => {
            try {
                await saveAnswer(session.id, lastChangedQId, localAnswers[lastChangedQId])
                setSaveStatus('saved')
            } catch (err) {
                setSaveStatus('error')
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [localAnswers, session?.id, saveAnswer, answers])

    const handleAnswerChange = (qId: string, text: string) => {
        setLocalAnswers(prev => ({ ...prev, [qId]: text }))
    }

    const handleSubmit = async () => {
        if (!session) return
        if (!confirm('Er du sikker på at du vil levere prøven? Du kan ikke endre svarene etterpå.')) {
            return
        }
        setSubmitting(true)
        try {
            await submitExam(session.id)
            navigate(`/prove/${code}/result`)
        } catch (err) {
            alert('Kunne ikke levere prøven. Prøv igjen.')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading && !exam) {
        return (
            <div className="page-center">
                <div className="spinner" />
                <p style={{ marginTop: 'var(--space-4)' }}>Laster prøve...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="page-center">
                <div className="error-msg" style={{ maxWidth: '400px', textAlign: 'center' }}>
                    {error}
                </div>
                <button className="btn btn--secondary" style={{ marginTop: 'var(--space-4)' }} onClick={() => navigate('/elev')}>
                    Tilbake
                </button>
            </div>
        )
    }

    if (!exam) return null

    return (
        <div className="page">
            <div className="dashboard-header" style={{ position: 'sticky', top: 'var(--header-height)', background: 'var(--c-bg)', zIndex: 10, padding: 'var(--space-4) 0' }}>
                <div>
                    <span className="badge badge--neutral" style={{ marginBottom: 'var(--space-1)' }}>{exam.subject}</span>
                    <h1>{exam.title}</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>Status</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--fs-sm)' }}>
                            {saveStatus === 'saving' ? (
                                <><div className="spinner" style={{ width: '12px', height: '12px' }} /> Lagrer...</>
                            ) : saveStatus === 'error' ? (
                                <span style={{ color: 'var(--c-error)' }}>Feil ved lagring</span>
                            ) : (
                                <span style={{ color: 'var(--c-success)' }}>Lagret ✓</span>
                            )}
                        </div>
                    </div>
                    <button
                        className="btn btn--primary btn--lg"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? 'Leverer...' : 'Lever prøve'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', marginTop: 'var(--space-8)' }}>
                {questions.map((q, idx) => (
                    <div key={q.id} className="card card--static">
                        <h3 style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <span style={{ color: 'var(--c-primary-text)' }}>{idx + 1}.</span>
                            <span style={{ flex: 1 }}>{q.questionText}</span>
                            <button
                                className="btn btn--secondary btn--sm"
                                onClick={() => {
                                    const utterance = new SpeechSynthesisUtterance(q.questionText)
                                    utterance.lang = 'nb-NO'
                                    window.speechSynthesis.speak(utterance)
                                }}
                                title="Les opp oppgave"
                                style={{ borderRadius: 'var(--radius-full)', padding: 'var(--space-2)' }}
                            >
                                🔊
                            </button>
                        </h3>

                        {q.type === 'mc' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {q.mcOptions?.map((opt, i) => (
                                    <label key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--space-3)',
                                        padding: 'var(--space-4)',
                                        background: localAnswers[q.id] === opt ? 'var(--c-primary-glow)' : 'var(--c-surface-elevated)',
                                        border: '1px solid',
                                        borderColor: localAnswers[q.id] === opt ? 'var(--c-primary)' : 'var(--c-border)',
                                        borderRadius: 'var(--radius-md)',
                                        cursor: 'pointer',
                                        transition: 'all var(--transition-fast)'
                                    }}>
                                        <input
                                            type="radio"
                                            name={`q-${q.id}`}
                                            checked={localAnswers[q.id] === opt}
                                            onChange={() => handleAnswerChange(q.id, opt)}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="input-group">
                                <textarea
                                    className="input"
                                    value={localAnswers[q.id] || ''}
                                    onChange={e => handleAnswerChange(q.id, e.target.value)}
                                    placeholder={q.type === 'short' ? 'Skriv ditt korte svar her...' : 'Skriv ditt langsvar her...'}
                                    style={{ minHeight: q.type === 'long' ? '240px' : '100px' }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
