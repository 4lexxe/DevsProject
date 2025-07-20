import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './user/contexts'
import ProtectedRoute from './user/contexts/ProtectedRoute'
import Layout from './dashboard/layout/Layout'
import DashboardHome from './dashboard/pages/DashboardHome'
import StudentsPage from './dashboard/pages/StudentsPage'
import LoginPage from './user/pages/LoginPage'
// import StudentProfilePage from './dashboard/pages/StudentProfilePage'
// import StudentEditPage from './dashboard/pages/StudentEditPage'
// import CoursesPage from './dashboard/pages/CoursesPage'
import "@/shared/styles/main.css"; // Importa tus estilos globales


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <AuthProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
              
            {/* Rutas protegidas del dashboard */}
            <Route path="/" element={
              <ProtectedRoute requiredRole={['admin', 'superadmin']}>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="students" element={<StudentsPage />} />
              {/* <Route path="students/:id" element={<StudentProfilePage />} />
              <Route path="students/:id/edit" element={<StudentEditPage />} />
              <Route path="courses" element={<CoursesPage />} /> */}
              <Route path="analytics" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Analíticas</h1>
                  <p className="text-gray-600">Próximamente...</p>
                </div>
              } />
              <Route path="settings" element={
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Configuración</h1>
                  <p className="text-gray-600">Próximamente...</p>
                </div>
              } />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App