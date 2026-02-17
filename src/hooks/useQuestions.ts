import { useState, useCallback } from 'react'
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Question } from '@/types/exam'

export function useQuestions(examId: string | undefined) {
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const subscribeToQuestions = useCallback(() => {
        if (!examId) return () => { }

        const q = query(
            collection(db, 'questions'),
            where('examId', '==', examId),
            orderBy('order', 'asc')
        )

        const unsub = onSnapshot(q, (snapshot) => {
            const questionData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Question[]

            setQuestions(questionData)
            setLoading(false)
        }, (err) => {
            console.error(err)
            setError('Kunne ikke hente spørsmål')
            setLoading(false)
        })

        return unsub
    }, [examId])

    const addQuestion = async (question: Omit<Question, 'id'>) => {
        return addDoc(collection(db, 'questions'), question)
    }

    const updateQuestion = async (id: string, updates: Partial<Question>) => {
        const questionRef = doc(db, 'questions', id)
        return updateDoc(questionRef, updates)
    }

    const deleteQuestion = async (id: string) => {
        const questionRef = doc(db, 'questions', id)
        return deleteDoc(questionRef)
    }

    return {
        questions,
        loading,
        error,
        subscribeToQuestions,
        addQuestion,
        updateQuestion,
        deleteQuestion
    }
}
