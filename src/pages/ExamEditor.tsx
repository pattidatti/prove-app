import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useExams } from '@/hooks/useExams'
import { useQuestions } from '@/hooks/useQuestions'
import type { Question, QuestionType } from '@/types/exam'

export default function ExamEditor() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { exams, createExam, updateExam } = useExams()
    const { questions, subscribeToQuestions, addQuestion, updateQuestion, deleteQuestion } = useQuestions(id)

    const [title, setTitle] = useState('')
    const [subject, setSubject] = useState('')
    const [duration, setDuration] = useState(60)
    const [autoSubmit, setAutoSubmit] = useState(false)
    const [saving, setSaving] = useState(false)

    // Load existing exam
    useEffect(() => {
        if (id && exams.length > 0) {
            const exam = exams.find(e => e.id === id)
            if (exam) {
                setTitle(exam.title)
                setSubject(exam.subject)
                setDuration(exam.durationMinutes)
                setAutoSubmit(exam.autoSubmitOnTimeout)
            }
        }
    }, [id, exams])

    useEffect(() => {
        if (id) return subscribeToQuestions()
    }, [id, subscribeToQuestions])

    const handleSaveExam = async () => {
        setSaving(true)
        try {
            if (id) {
                await updateExam(id, {
                    title,
                    subject,
                    durationMinutes: duration,
                    autoSubmitOnTimeout: autoSubmit
                })
            } else {
                const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase()
                const newDoc = await createExam({
                    title,
                    subject,
                    durationMinutes: duration,
                    autoSubmitOnTimeout: autoSubmit,
                    isActive: false,
                    accessCode,
                })
                navigate(`/laerer/rediger/${newDoc.id}`)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    const handleAddQuestion = async (type: QuestionType) => {
        if (!id) return
        await addQuestion({
            examId: id,
            order: questions.length,
            type,
            questionText: '',
            correctAnswer: '',
            maxPoints: type === 'long' ? 10 : 2,
            mcOptions: type === 'mc' ? ['', '', '', ''] : undefined
        })
    }

    return (
        <div className="page">
            <div className="dashboard-header">
                <h1>{id ? 'Rediger prøve' : 'Ny prøve'}</h1>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button className="btn btn--secondary" onClick={() => navigate('/laerer')}>Avbryt</button>
                    <button className="btn btn--primary" onClick={handleSaveExam} disabled={saving}>
                        {saving ? 'Lagrer...' : 'Lagre hovedinfo'}
                    </button>
                </div>
            </div>

            <div className="card card--static" style={{ marginBottom: 'var(--space-8)' }}>
                <div className="auth-form">
                    <div className="input-group">
                        <label>Prøvenavn</label>
                        <input
                            className="input"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="F.eks. Kapittelprøve: Første verdenskrig"
                        />
                    </div>
                    <div className="input-group">
                        <label>Fag</label>
                        <input
                            className="input"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            placeholder="F.eks. Samfunnsfag"
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div className="input-group">
                            <label>Tid i minutter</label>
                            <input
                                className="input"
                                type="number"
                                value={duration}
                                onChange={e => setDuration(parseInt(e.target.value))}
                            />
                        </div>
                        <div className="input-group" style={{ justifyContent: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={autoSubmit}
                                    onChange={e => setAutoSubmit(e.target.checked)}
                                />
                                Auto-lever ved slutten av tida
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {id && (
                <section>
                    <div className="dashboard-header" style={{ marginTop: 'var(--space-10)' }}>
                        <h2>Oppgaver</h2>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="btn btn--secondary btn--sm" onClick={() => handleAddQuestion('mc')}>+ Multiple Choice</button>
                            <button className="btn btn--secondary btn--sm" onClick={() => handleAddQuestion('short')}>+ Kortsvar</button>
                            <button className="btn btn--secondary btn--sm" onClick={() => handleAddQuestion('long')}>+ Langsvar</button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {questions.map((q, idx) => (
                            <QuestionItem
                                key={q.id}
                                question={q}
                                index={idx}
                                onUpdate={(updates) => updateQuestion(q.id, updates)}
                                onDelete={() => deleteQuestion(q.id)}
                            />
                        ))}
                        {questions.length === 0 && (
                            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
                                <p>Ingen oppgaver ennå. Legg til en oppgave ovenfor.</p>
                            </div>
                        )}
                    </div>
                </section>
            )}
        </div>
    )
}

function QuestionItem({ question, index, onUpdate, onDelete }: {
    question: Question,
    index: number,
    onUpdate: (updates: Partial<Question>) => void,
    onDelete: () => void
}) {
    return (
        <div className="card card--static">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                <span className="badge badge--neutral">Oppgave {index + 1} ({question.type.toUpperCase()})</span>
                <button className="btn btn--ghost btn--sm" onClick={onDelete} style={{ color: 'var(--c-error)' }}>Slett</button>
            </div>

            <div className="auth-form">
                <div className="input-group">
                    <label>Oppgavetekst</label>
                    <textarea
                        className="input"
                        value={question.questionText}
                        onChange={e => onUpdate({ questionText: e.target.value })}
                        placeholder="Hva vil du spørre om?"
                    />
                </div>

                {question.type === 'mc' && (
                    <div className="input-group">
                        <label>Alternativer (Merk korrekt svar)</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {question.mcOptions?.map((opt, i) => (
                                <div key={i} style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <input
                                        type="radio"
                                        name={`correct-${question.id}`}
                                        checked={question.correctAnswer === opt && opt !== ''}
                                        onChange={() => onUpdate({ correctAnswer: opt })}
                                    />
                                    <input
                                        className="input"
                                        style={{ flex: 1 }}
                                        value={opt}
                                        onChange={e => {
                                            const newOpts = [...(question.mcOptions || [])]
                                            newOpts[i] = e.target.value
                                            onUpdate({ mcOptions: newOpts })
                                        }}
                                        placeholder={`Alternativ ${i + 1}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {question.type !== 'mc' && (
                    <div className="input-group">
                        <label>Fasit / Stikkord til AI</label>
                        <textarea
                            className="input"
                            value={question.correctAnswer}
                            onChange={e => onUpdate({ correctAnswer: e.target.value })}
                            placeholder="Hva er det korrekte eller forventede svaret?"
                        />
                    </div>
                )}

                <div className="input-group">
                    <label>Maks karakter for denne oppgaven (brukes som vekting)</label>
                    <input
                        className="input"
                        type="number"
                        value={question.maxPoints}
                        onChange={e => onUpdate({ maxPoints: parseInt(e.target.value) })}
                    />
                </div>
            </div>
        </div>
    )
}
