import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./user/contexts";
import ProtectedRoute from "./user/contexts/ProtectedRoute";
import Layout from "./dashboard/layout/Layout";
import DashboardHome from "./dashboard/pages/DashboardHome";
import UsersPage from "./user/pages/UsersPage";
import UserEditPage from "./user/pages/UserEditPage";
import UserProfilePage from "./user/pages/UserProfilePage";
import RolesPage from "./user/pages/RolesPage";
import RoleEditPage from "./user/pages/RoleEditPage";
import LoginPage from "./user/pages/LoginPage";

import {
  CoursesPage,
  CourseDetail,
  CourseFormPage,
  SectionFormPage,
  SectionPage,
  CourseDiscountEvent,
  DiscountEventsList,
  QuizFormPage,
  FileUploadPage,
  FileManagementPage
} from "@/course/index";


import HeaderSectionAdminPage from "./header-section/page/HeaderSectionAdminPage";
import "@/shared/styles/main.css"; // Importa tus estilos globales

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

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
            <Route
              path="/"
              element={
                <ProtectedRoute requiredRole={["admin", "superadmin"]}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Aquí dentro ya heredan la protección */}
              <Route index element={<DashboardHome />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserProfilePage />} />
              <Route path="users/:id/edit" element={<UserEditPage />} />
              
              {/* Rutas de Roles */}
              <Route path="roles" element={<RolesPage />} />
              <Route path="roles/new" element={<RoleEditPage />} />
              <Route path="roles/:id/edit" element={<RoleEditPage />} />
              
              <Route
                path="header-section"
                element={<HeaderSectionAdminPage />}
              />

              {/* Area de cursos */}
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="courses/:id/edit" element={<CourseFormPage />} />
              <Route path="courses/new" element={<CourseFormPage />} />
              <Route
                path="courses/:courseId/section/form"
                element={<SectionFormPage />}
              />
              <Route
                path="courses/:courseId/section/:sectionId/edit"
                element={<SectionFormPage />}
              />
              
              <Route path="sections/:id" element={<SectionPage />} />

              {/* Rutas para Quiz */}
              <Route
                path="/contents/:contentId/quiz/new"
                element={<QuizFormPage />}
              />
              <Route
                path="/contents/:contentId/quiz/edit"
                element={<QuizFormPage />}
              />
              <Route
                path="courses/:courseId/section/:sectionId/quiz"
                element={<QuizFormPage />}
              />

              {/* Rutas para Gestión de Archivos */}
              <Route
                path="/contents/:contentId/files"
                element={<FileManagementPage />}
              />
              <Route
                path="/contents/:contentId/files/upload"
                element={<FileUploadPage />}
              />

              <Route
                path="courses/discount-events"
                element={<DiscountEventsList />}
              />
              <Route
                path="courses/discount-event/create"
                element={<CourseDiscountEvent />}
              />
              <Route
                path="courses/discount-event/edit"
                element={<CourseDiscountEvent />}
              />

              <Route
                path="analytics"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Analíticas</h1>
                    <p className="text-gray-600">Próximamente...</p>
                  </div>
                }
              />
              <Route
                path="settings"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Configuración</h1>
                    <p className="text-gray-600">Próximamente...</p>
                  </div>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
