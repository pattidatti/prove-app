import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useGrading } from '@/hooks/useGrading'
import { useQuestions } from '@/hooks/useQuestions'
import { useGemini } from '@/hooks/useGemini'
import type { Answer } from '@/types/exam'

export default function StudentGrading() {
    const { examId, sessionId } = useParams<{ examId: string, sessionId: string }>()
    const navigate = useNavigate()
    const { sessions, getSessionAnswers, updateAnswerGrade, updateSessionGrade } = useGrading(examId)
    const { questions, subscribeToQuestions } = useQuestions(examId)
    const { gradeAnswer, loading: aiLoading } = useGemini()

    const [sessionAnswers, setSessionAnswers] = useState<Answer[]>([])
    const [loading, setLoading] = useState(true)
    const [grade, setGrade] = useState('')
    const [feedback, setFeedback] = useState('')
    const [saving, setSaving] = useState(false)

    const handleAIGrade = async (qId: string, answer: Answer | undefined) => {
        const question = questions.find(q => q.id === qId)
        if (!question || !answer) return

        try {
            const result = await gradeAnswer(
                question.questionText,
                question.correctAnswer,
                answer.studentAnswer || '',
                question.maxPoints
            )

            await updateAnswerGrade(answer.id, {
                points: result.points,
                aiFeedback: result.feedback
            })

            setSessionAnswers(prev => prev.map(a =>
                a.id === answer.id ? { ...a, points: result.points, aiFeedback: result.feedback } : a
            ))
        } catch (err) {
            alert('AI-retting feilet. Sjekk API-nøkkelen din.')
        }
    }

    const session = sessions.find(s => s.id === sessionId)

    useEffect(() => {
        if (examId) return subscribeToQuestions()
    }, [examId, subscribeToQuestions])

    useEffect(() => {
        if (sessionId) {
            getSessionAnswers(sessionId).then(ans => {
                setSessionAnswers(ans)
                setLoading(false)
            })
        }
        if (session) {
            setGrade(session.grade || '')
            setFeedback(session.feedback || '')
        }
    }, [sessionId, session])

    const handlePointChange = async (answerId: string, points: number) => {
        await updateAnswerGrade(answerId, { points })
        setSessionAnswers(prev => prev.map(a => a.id === answerId ? { ...a, points } : a))
    }

    const handleSaveFinal = async () => {
        if (!sessionId) return
        setSaving(true)
        await updateSessionGrade(sessionId, grade, feedback)
        setSaving(false)
        alert('Vurdering lagret!')
        navigate(`/laerer/besvarelser/${examId}`)
    }

    if (loading) return <div className="page-center"><div className="spinner" /></div>

    return (
        <div className="page">
            <div className="dashboard-header">
                <div>
                    <Link to={`/laerer/besvarelser/${examId}`} className="back-link">← Tilbake til alle besvarelser</Link>
                    <h1>Rette: {session?.studentName}</h1>
                </div>
                <button className="btn btn--primary" onClick={handleSaveFinal} disabled={saving}>
                    {saving ? 'Lagrer...' : 'Lagre vurdering'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-8)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    {questions.map((q, idx) => {
                        const answer = sessionAnswers.find(a => a.questionId === q.id)
                        return (
                            <div key={q.id} className="card card--static">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                    <h3 style={{ margin: 0 }}>Oppgave {idx + 1}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <span>Poeng:</span>
                                        <input
                                            type="number"
                                            className="input input--sm"
                                            style={{ width: '60px' }}
                                            value={answer?.points || 0}
                                            onChange={e => answer && handlePointChange(answer.id, parseInt(e.target.value))}
                                        />
                                        <span style={{ color: 'var(--c-text-muted)' }}>/ {q.maxPoints}</span>
                                    </div>
                                </div>

                                <p style={{ fontWeight: 500 }}>{q.questionText}</p>

                                <div style={{ padding: 'var(--space-4)', background: 'var(--c-surface-elevated)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }}>
                                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)', marginBottom: 'var(--space-1)' }}>Elevens svar:</div>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{answer?.studentAnswer || '(Intet svar)'}</div>
                                </div>

                                {answer?.aiFeedback && (
                                    <div style={{ padding: 'var(--space-4)', background: 'var(--c-primary-soft)', borderLeft: '4px solid var(--c-primary)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)', fontSize: 'var(--fs-sm)' }}>
                                        <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>🤖 AI Forslag:</div>
                                        {answer.aiFeedback}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-text-muted)' }}>Fasit / Stikkord:</div>
                                        <div style={{ fontSize: 'var(--fs-sm)', opacity: 0.8 }}>{q.correctAnswer}</div>
                                    </div>
                                    <button
                                        className="btn btn--secondary btn--sm"
                                        onClick={() => handleAIGrade(q.id, answer)}
                                        disabled={aiLoading || !answer}
                                    >
                                        {aiLoading ? 'Tenker...' : 'Rett oppgave med AI'}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div style={{ position: 'sticky', top: 'var(--space-8)', height: 'fit-content' }}>
                    <div className="card card--static">
                        <h3>Sluttvurdering</h3>
                        <div className="input-group">
                            <label>Karakter / Resultat</label>
                            <input
                                className="input"
                                value={grade}
                                onChange={e => setGrade(e.target.value)}
                                placeholder="F.eks. 5 eller Bestått"
                            />
                        </div>
                        <div className="input-group">
                            <label>Tilbakemelding</label>
                            <textarea
                                className="input"
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                placeholder="Skriv en kommentar til eleven..."
                                style={{ minHeight: '200px' }}
                            />
                        </div>
                        <button
                            className="btn btn--secondary btn--lg"
                            style={{ width: '100%', marginTop: 'var(--space-4)' }}
                            onClick={async () => {
                                for (const q of questions) {
                                    const answer = sessionAnswers.find(a => a.questionId === q.id)
                                    if (answer) await handleAIGrade(q.id, answer)
                                }
                            }}
                            disabled={aiLoading}
                        >
                            {aiLoading ? 'Retter alle...' : '🤖 Rett hele prøven med AI'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
