import { useState, useCallback } from 'react'
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
    type Unsubscribe
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Exam } from '@/types/exam'
import { useAuthContext } from '@/contexts/AuthContext'

export function useExams() {
    const { user } = useAuthContext()
    const [exams, setExams] = useState<Exam[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Listen to teacher's exams
    const subscribeToExams = useCallback(() => {
        if (!user || user.role !== 'teacher') return () => { }

        const q = query(
            collection(db, 'exams'),
            where('teacherId', '==', user.uid)
        )

        const unsub = onSnapshot(q, (snapshot) => {
            const examData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            })) as Exam[]

            setExams(examData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
            setLoading(false)
        }, (err) => {
            console.error(err)
            setError('Kunne ikke hente prøver')
            setLoading(false)
        })

        return unsub
    }, [user])

    const createExam = async (exam: Omit<Exam, 'id' | 'teacherId' | 'createdAt'>) => {
        if (!user) throw new Error('Må være logget inn')

        return addDoc(collection(db, 'exams'), {
            ...exam,
            teacherId: user.uid,
            createdAt: serverTimestamp()
        })
    }

    const updateExam = async (id: string, updates: Partial<Exam>) => {
        const examRef = doc(db, 'exams', id)
        return updateDoc(examRef, updates)
    }

    const deleteExam = async (id: string) => {
        const examRef = doc(db, 'exams', id)
        return deleteDoc(examRef)
    }

    return {
        exams,
        loading,
        error,
        subscribeToExams,
        createExam,
        updateExam,
        deleteExam
    }
}
