import { useState } from 'react'
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Exam, ExamSession, Answer } from '@/types/exam'
import { useAuthContext } from '@/contexts/AuthContext'

export function useExamSession() {
    const { user } = useAuthContext()
    const [exam, setExam] = useState<Exam | null>(null)
    const [session, setSession] = useState<ExamSession | null>(null)
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Find and join exam by access code
    const joinExam = async (accessCode: string, studentName: string) => {
        setLoading(true)
        setError(null)
        try {
            // 1. Find exam
            const q = query(collection(db, 'exams'), where('accessCode', '==', accessCode.toUpperCase()))
            const snapshot = await getDocs(q)

            if (snapshot.empty) {
                throw new Error('Ugyldig prøvekode')
            }

            const examDoc = snapshot.docs[0]
            const examData = { id: examDoc.id, ...examDoc.data() } as Exam

            if (!examData.isActive) {
                throw new Error('Denne prøven er ikke aktiv ennå')
            }

            setExam(examData)

            // 2. Create or find session
            if (!user) throw new Error('Ikke autentisert')

            const sessionQ = query(
                collection(db, 'sessions'),
                where('examId', '==', examData.id),
                where('anonymousUid', '==', user.uid)
            )
            const sessionSnapshot = await getDocs(sessionQ)

            let sessionId = ''
            if (sessionSnapshot.empty) {
                const newSession = await addDoc(collection(db, 'sessions'), {
                    examId: examData.id,
                    studentName,
                    anonymousUid: user.uid,
                    startedAt: serverTimestamp(),
                    status: 'active'
                })
                sessionId = newSession.id
            } else {
                sessionId = sessionSnapshot.docs[0].id
                const existingSession = { id: sessionId, ...sessionSnapshot.docs[0].data() } as ExamSession
                if (existingSession.status !== 'active') {
                    throw new Error('Du har allerede levert denne prøven')
                }
            }

            // 3. Subscribe to session for real-time status (e.g. graded)
            onSnapshot(doc(db, 'sessions', sessionId), (doc) => {
                setSession({ id: doc.id, ...doc.data() } as ExamSession)
            })

            // 4. Load existing answers
            const answersQ = query(collection(db, 'answers'), where('sessionId', '==', sessionId))
            const answersSnapshot = await getDocs(answersQ)
            const answersMap: Record<string, string> = {}
            answersSnapshot.forEach(doc => {
                const data = doc.data() as Answer
                answersMap[data.questionId] = data.studentAnswer
            })
            setAnswers(answersMap)

            setLoading(false)
            return { examId: examData.id, sessionId }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Noe gikk galt')
            setLoading(false)
            throw err
        }
    }

    const saveAnswer = async (sessionId: string, questionId: string, text: string) => {
        // 1. Find existing answer doc
        const q = query(
            collection(db, 'answers'),
            where('sessionId', '==', sessionId),
            where('questionId', '==', questionId)
        )
        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            await addDoc(collection(db, 'answers'), {
                sessionId,
                questionId,
                studentAnswer: text,
                gradingStatus: 'pending'
            })
        } else {
            await updateDoc(doc(db, 'answers', snapshot.docs[0].id), {
                studentAnswer: text
            })
        }

        setAnswers(prev => ({ ...prev, [questionId]: text }))
    }

    const submitExam = async (sessionId: string) => {
        const sessionRef = doc(db, 'sessions', sessionId)
        await updateDoc(sessionRef, {
            status: 'submitted',
            submittedAt: serverTimestamp()
        })
    }

    return {
        exam,
        session,
        answers,
        loading,
        error,
        joinExam,
        saveAnswer,
        submitExam
    }
}
