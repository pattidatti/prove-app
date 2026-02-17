import { useState, useCallback } from 'react'
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    getDocs,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ExamSession, Answer } from '@/types/exam'

export function useGrading(examId: string | undefined) {
    const [sessions, setSessions] = useState<ExamSession[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // 1. Subscribe to all sessions for an exam
    const subscribeToSessions = useCallback(() => {
        if (!examId) return () => { }

        const q = query(
            collection(db, 'sessions'),
            where('examId', '==', examId)
        )

        const unsub = onSnapshot(q, (snapshot) => {
            const sessionData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                startedAt: doc.data().startedAt?.toDate(),
                submittedAt: doc.data().submittedAt?.toDate()
            })) as ExamSession[]

            setSessions(sessionData.sort((a, b) => (b.submittedAt?.getTime() || 0) - (a.submittedAt?.getTime() || 0)))
            setLoading(false)
        }, (err) => {
            console.error(err)
            setError('Kunne ikke hente besvarelser')
            setLoading(false)
        })

        return unsub
    }, [examId])

    // 2. Fetch answers for a specific session
    const getSessionAnswers = async (sessionId: string) => {
        const q = query(
            collection(db, 'answers'),
            where('sessionId', '==', sessionId)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Answer[]
    }

    // 3. Update answer grade/points
    const updateAnswerGrade = async (answerId: string, updates: Partial<Answer>) => {
        const answerRef = doc(db, 'answers', answerId)
        await updateDoc(answerRef, {
            ...updates,
            gradingStatus: 'graded'
        })
    }

    // 4. Update overall session grade
    const updateSessionGrade = async (sessionId: string, grade: string, feedback: string) => {
        const sessionRef = doc(db, 'sessions', sessionId)
        await updateDoc(sessionRef, {
            grade,
            feedback,
            status: 'graded'
        })
    }

    return {
        sessions,
        loading,
        error,
        subscribeToSessions,
        getSessionAnswers,
        updateAnswerGrade,
        updateSessionGrade
    }
}
