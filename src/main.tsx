import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import TeacherLogin from '@/pages/TeacherLogin'
import TeacherDashboard from '@/pages/TeacherDashboard'
import ExamEditor from '@/pages/ExamEditor'
import StudentJoin from '@/pages/StudentJoin'
import ExamTaking from '@/pages/ExamTaking'
import ExamSubmissions from '@/pages/ExamSubmissions'
import StudentGrading from '@/pages/StudentGrading'
import ExamResult from '@/pages/ExamResult'
import './index.css'

// Restore dyslexia mode from localStorage
if (localStorage.getItem('dyslexia-mode') === '1') {
    document.body.classList.add('dyslexia-mode')
}

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/laerer/login', element: <TeacherLogin /> },
            { path: '/elev', element: <StudentJoin /> },
            {
                path: '/laerer',
                element: (
                    <ProtectedRoute role="teacher">
                        <TeacherDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/laerer/ny',
                element: (
                    <ProtectedRoute role="teacher">
                        <ExamEditor />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/laerer/rediger/:id',
                element: (
                    <ProtectedRoute role="teacher">
                        <ExamEditor />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/prove/:code',
                element: (
                    <ProtectedRoute role="student">
                        <ExamTaking />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/prove/:code/result',
                element: (
                    <ProtectedRoute role="student">
                        <ExamResult />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/laerer/besvarelser/:id',
                element: (
                    <ProtectedRoute role="teacher">
                        <ExamSubmissions />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/laerer/retting/:examId/:sessionId',
                element: (
                    <ProtectedRoute role="teacher">
                        <StudentGrading />
                    </ProtectedRoute>
                ),
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>,
)
