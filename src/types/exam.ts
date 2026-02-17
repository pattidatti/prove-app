/* ===========================
   Type Definitions — Prøve App
   =========================== */

// --- Question Types ---
export type QuestionType = 'mc' | 'short' | 'long'

export interface Question {
    id: string
    examId: string
    order: number
    type: QuestionType
    questionText: string
    /** Only for MC questions */
    mcOptions?: string[]
    correctAnswer: string
    maxPoints: number
}

// --- Exam ---
export interface Exam {
    id: string
    teacherId: string
    title: string
    subject: string
    durationMinutes: number
    isActive: boolean
    accessCode: string
    /** Whether to auto-submit when time runs out */
    autoSubmitOnTimeout: boolean
    createdAt: Date
}

// --- Grading Criteria ---
export interface GradingCriteria {
    examId: string
    gradingInstructions: string
    /** Kjennetegn på måloppnåelse */
    achievementLevels: {
        low: string    // Karakter 1-2
        medium: string // Karakter 3-4
        high: string   // Karakter 5-6
    }
}

// --- Student Session ---
export type SessionStatus = 'active' | 'submitted' | 'graded'

export interface ExamSession {
    id: string
    examId: string
    studentName: string
    anonymousUid: string
    startedAt: Date
    submittedAt?: Date
    status: SessionStatus
    /** Overall grade 1-6 or descriptive */
    grade?: string
    feedback?: string
    /** Numeric total for internal calculation */
    totalGrade?: number
}

// --- Answer ---
export type GradingStatus = 'pending' | 'graded'

export interface Answer {
    id: string
    sessionId: string
    questionId: string
    studentAnswer: string
    points?: number
    /** Grade 1-6 if applicable per question */
    grade?: number
    aiFeedback?: string
    gradingStatus: GradingStatus
}

// --- Auth ---
export type UserRole = 'teacher' | 'student'

export interface AppUser {
    uid: string
    role: UserRole
    displayName: string
    email?: string
}
