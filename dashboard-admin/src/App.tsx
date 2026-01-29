import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./user/contexts";
import { ThemeProvider } from "./shared/contexts/ThemeContext";
import ProtectedRoute from "./user/contexts/ProtectedRoute";
import Layout from "./dashboard/layout/Layout";
import DashboardHome from "./dashboard/pages/DashboardHome";
import StudentsPage from "./user/pages/StudentsPage";
import StudentEditPage from "./user/pages/StudentEditPage";
import StudentProfilePage from "./user/pages/StudentProfilePage";
import LoginPage from "./user/pages/LoginPage";

import {
  CoursesPage,
  CourseDetail,
  CourseFormPage,
  CourseHeaderEditorPage,
  SectionFormPage,
  SectionPage,
  CourseDiscountEvent,
  DiscountEventsList,
  QuizFormPage,
  FileUploadPage,
  FileManagementPage
} from "@/course/index";


import HeaderSectionAdminPage from "./header-section/page/HeaderSectionAdminPage";
import RolesPage from "./role/pages/RolesPage";
import PermissionsPage from "./permission/pages/PermissionsPage";
import CategoriesPage from "./course/pages/CategoriesPage";
import CareerTypesPage from "./course/pages/CareerTypesPage";
import SectionsPage from "./course/pages/SectionsPage";
import ContentsPage from "./course/pages/ContentsPage";
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
      <ThemeProvider>
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
                <Route path="students" element={<StudentsPage />} />
                <Route path="students/:id" element={<StudentProfilePage />} />
                <Route path="students/:id/edit" element={<StudentEditPage />} />
                <Route
                  path="header-section"
                  element={<HeaderSectionAdminPage />}
                />

                {/* Gestión de Roles */}
                <Route path="roles" element={<RolesPage />} />

                {/* Gestión de Permisos */}
                <Route path="roles/permissions" element={<PermissionsPage />} />

                {/* Gestión de Categorías */}
                <Route path="courses/categories" element={<CategoriesPage />} />

                {/* Gestión de Tipos de Carrera */}
                <Route path="courses/career-types" element={<CareerTypesPage />} />

                {/* Area de cursos */}
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/headers" element={<CourseHeaderEditorPage />} />
                <Route path="courses/:slug" element={<CourseDetail />} />
                <Route path="courses/:slug/edit" element={<CourseFormPage />} />
                <Route path="courses/new" element={<CourseFormPage />} />
                <Route
                  path="courses/:courseId/section/form"
                  element={<SectionFormPage />}
                />
                <Route
                  path="courses/:courseId/section/:sectionId/edit"
                  element={<SectionFormPage />}
                />
                
                {/* Gestión de Secciones */}
                <Route path="sections" element={<SectionsPage />} />
                <Route path="sections/:id" element={<SectionPage />} />

                {/* Gestión de Contenidos */}
                <Route path="contents" element={<ContentsPage />} />

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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
