import { GoogleGenerativeAI } from '@google/generative-ai'
import { useState } from 'react'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export function useGemini() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const gradeAnswer = async (
        question: string,
        correctAnswer: string,
        studentAnswer: string,
        maxPoints: number
    ) => {
        if (!API_KEY || API_KEY === 'placeholder-fill-this-in') {
            throw new Error('Gemini API-nøkkel mangler. Vennligst legg den inn i .env')
        }

        setLoading(true)
        setError(null)
        try {
            const genAI = new GoogleGenerativeAI(API_KEY)
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

            const prompt = `
            Du er en lærer som skal rette en prøveoppgave.
            
            Oppgave: "${question}"
            Fasit/Mål: "${correctAnswer}"
            Elevens svar: "${studentAnswer}"
            Maks poeng: ${maxPoints}
            
            Vurder elevens svar opp mot fasiten. Gi en poengsum fra 0 til ${maxPoints} og en kort, konstruktiv tilbakemelding på norsk.
            Svaret MÅ være i JSON-format slik:
            {
                "points": number,
                "feedback": "streng"
            }
            `

            const result = await model.generateContent(prompt)
            const responseTxt = result.response.text()

            // Clean JSON in case model adds ```json ... ```
            const cleanJson = responseTxt.replace(/```json|```/g, '').trim()
            const parsed = JSON.parse(cleanJson)

            setLoading(false)
            return parsed as { points: number; feedback: string }
        } catch (err) {
            console.error('Gemini error:', err)
            setError('Kunne ikke hente vurdering fra AI')
            setLoading(false)
            throw err
        }
    }

    return {
        gradeAnswer,
        loading,
        error
    }
}
