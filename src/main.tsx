import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import ProtectedRoute from '@/components/ProtectedRoute'
import Home from '@/pages/Home'
import TeacherLogin from '@/pages/TeacherLogin'
import TeacherDashboard from '@/pages/TeacherDashboard'
import StudentJoin from '@/pages/StudentJoin'
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
            // Fase 2+3: Exam editor and exam-taking routes will be added here
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
