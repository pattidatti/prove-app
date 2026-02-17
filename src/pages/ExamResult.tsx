import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useExamSession } from '@/hooks/useExamSession'
import { useQuestions } from '@/hooks/useQuestions'
import { useGrading } from '@/hooks/useGrading'
import type { Answer } from '@/types/exam'

export default function ExamResult() {
    const { code } = useParams<{ code: string }>()
    const { exam, session, loading: sessionLoading } = useExamSession()
    const { questions, subscribeToQuestions } = useQuestions(exam?.id)
    const { getSessionAnswers } = useGrading(exam?.id)

    const [answers, setAnswers] = useState<Answer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Since students might come back to this URL, we need to make sure they are "joined" 
        // using the anonymous session already in progress.
        // For simplicity, we assume they just finished the exam or are redirected here.
        if (code && !exam) {
            // In a real app, we'd check local storage for student name or session ID
            // For now, we rely on the redirect from ExamTaking
        }
    }, [code, exam])

    useEffect(() => {
        if (exam?.id) return subscribeToQuestions()
    }, [exam?.id, subscribeToQuestions])

    useEffect(() => {
        if (session?.id) {
            getSessionAnswers(session.id).then(ans => {
                setAnswers(ans)
                setLoading(false)
            })
        }
    }, [session?.id])

    if (sessionLoading || loading) return <div className="page-center"><div className="spinner" /></div>

    if (session?.status !== 'graded' && session?.status !== 'submitted') {
        return (
            <div className="page-center">
                <div className="card card--static" style={{ textAlign: 'center' }}>
                    <h1>Prøven er ikke levert ennå</h1>
                    <p>Du må fullføre prøven før du kan se resultatet.</p>
                    <Link to={`/prove/${code}`} className="btn btn--primary">Gå til prøven</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="page result-page">
            <div className="result-header">
                <div className="badge badge--success" style={{ marginBottom: 'var(--space-4)' }}>
                    Prøve fullført
                </div>
                <h1>{exam?.title}</h1>
                <p className="lead">{session.studentName}, her er din vurdering</p>

                {session.status === 'graded' ? (
                    <div className="grade-box card card--static">
                        <div className="grade-label">Karakter / Resultat</div>
                        <div className="grade-value">{session.grade || 'Fullført'}</div>
                        {session.feedback && (
                            <div className="feedback-text">
                                <strong>Lærerens kommentar:</strong><br />
                                {session.feedback}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="card card--static" style={{ background: 'var(--c-surface-elevated)' }}>
                        <p><strong>Status: Levert.</strong> Læreren retter prøven din nå. Kom tilbake senere for å se karakter og tilbakemelding.</p>
                    </div>
                )}
            </div>

            <div className="answers-review">
                <h2>Dine svar</h2>
                <div className="answers-list">
                    {questions.map((q, idx) => {
                        const answer = answers.find(a => a.questionId === q.id)
                        return (
                            <div key={q.id} className="card card--static answer-card">
                                <div className="answer-card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <h3>Oppgave {idx + 1}</h3>
                                        <button
                                            className="btn btn--ghost btn--sm"
                                            onClick={() => {
                                                const text = `${q.questionText}. Ditt svar var: ${answer?.studentAnswer || '(Ikke besvart)'}. ${answer?.aiFeedback ? 'Tilbakemelding: ' + answer.aiFeedback : ''}`
                                                const utterance = new SpeechSynthesisUtterance(text)
                                                utterance.lang = 'nb-NO'
                                                window.speechSynthesis.speak(utterance)
                                            }}
                                            title="Les opp"
                                            style={{ padding: '0 var(--space-2)', minWidth: 'auto' }}
                                        >
                                            🔊
                                        </button>
                                    </div>
                                    {session.status === 'graded' && answer && (
                                        <div className="points-badge">
                                            {answer.points ?? 0} / {q.maxPoints} poeng
                                        </div>
                                    )}
                                </div>
                                <p className="question-text">{q.questionText}</p>

                                <div className="student-answer-box">
                                    <div className="box-label">Ditt svar:</div>
                                    <div className="text-content">{answer?.studentAnswer || '(Ikke besvart)'}</div>
                                </div>

                                {session.status === 'graded' && answer?.aiFeedback && (
                                    <div className="ai-feedback-box">
                                        <div className="box-label">Tilbakemelding:</div>
                                        <div className="text-content">{answer.aiFeedback}</div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
                <Link to="/" className="btn btn--ghost">Ferdig</Link>
            </div>
        </div>
    )
}
