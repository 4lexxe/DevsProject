import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./auth/contexts/AuthContext";
import { ReactFlowProvider } from "reactflow";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Importación de todos los estilos
import "@/shared/assets/styles/main.css";
import '@xyflow/react/dist/style.css';
import "@/shared/assets/styles/roadmap.css";

// Importación de los componentes
import DefaultLayout from "./shared/layouts/defaultLayout";
import Home from "./home/home";

import { CoursesPage, CourseFormPage, CourseDetail, QuizPage, Profile, SectionFormPage, ContentPage }from '@/course/index';

import { LoginPage, RegisterPage } from "./auth/auth";
import AboutUs from "./shared/components/navigation/AboutUs";

import LearnRoute from './learnroute/pages/LearnRoute';
import ResourcePage from './recourse/pages/resources/resourcePages';
import CreateResourceForm from './recourse/pages/form/CreateResourceForm';
import ResourceDetailsPage from './recourse/pages/resourceDetails/ResourceDetailsPage';
import ProtectedRoute from './auth/contexts/ProtectedRoute'; // Importa el componente de protección
import ProtectedRouteAdmin from './auth/contexts/ProtectRouteAdmin';

import RoadmapEditor from "./learnroute/components/RoadmapEditor";
import Roadmap from "./learnroute/pages/RoadMap";
import { Toaster } from 'react-hot-toast';
import NotFound from "./shared/components/NotFound";
import Dashboard from './dashboard/components/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});

// Datos estáticos para el dashboard
const mockDashboardData = {
  currentUser: {
    id: 1,
    name: "Admin Usuario",
    email: "admin@example.com",
    role: "admin"
  },
  courses: [
    { id: 1, title: "Introducción a React", students: 45, progress: 78 },
    { id: 2, title: "Desarrollo Backend con Node.js", students: 32, progress: 62 },
    { id: 3, title: "Diseño UI/UX", students: 28, progress: 55 }
  ],
  notifications: [
    { id: 1, message: "Nuevo estudiante registrado", time: "hace 5 minutos" },
    { id: 2, message: "Curso completado por usuario", time: "hace 1 hora" }
  ],
  assignments: [
    { id: 1, title: "Proyecto Final React", dueDate: "2023-12-15", submissions: 12 },
    { id: 2, title: "Práctica de APIs", dueDate: "2023-12-10", submissions: 8 }
  ],
  calendarEvents: [
    { id: 1, title: "Webinar: JavaScript Avanzado", date: "2023-12-05", time: "18:00" },
    { id: 2, title: "Revisión de Proyecto", date: "2023-12-08", time: "15:30" }
  ],
  students: [
    { 
      id: 1, 
      name: "Juan Pérez", 
      email: "juan@example.com", 
      enrolledCourses: 2, 
      progress: 75, 
      lastActive: "2023-11-30", 
      status: "active",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    { 
      id: 2, 
      name: "María García", 
      email: "maria@example.com", 
      enrolledCourses: 3, 
      progress: 60, 
      lastActive: "2023-11-28", 
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    { 
      id: 3, 
      name: "Carlos López", 
      email: "carlos@example.com", 
      enrolledCourses: 1, 
      progress: 45, 
      lastActive: "2023-11-25", 
      status: "inactive",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ],
                        { id: 2, title: "Node.js", students: 32, progress: 62 }
  revenueData: {
    thisMonth: 5200,
    lastMonth: 4800,
    growth: 8.33
  },
  systemStats: {
    totalUsers: 580,
    activeCourses: 12,
    totalRevenue: 28500
  }
};

// Componente contenedor simplificado para el Dashboard
const DashboardContainer = () => (
  <div className="container mx-auto px-4 py-6">
    <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
    <Dashboard 
      user={mockDashboardData.currentUser}
      courses={mockDashboardData.courses}
      notifications={mockDashboardData.notifications}
      assignments={mockDashboardData.assignments}
      calendarEvents={mockDashboardData.calendarEvents}
      students={mockDashboardData.students}
      revenueData={mockDashboardData.revenueData}
      systemStats={mockDashboardData.systemStats}
    />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="cursos" element={<CoursesPage />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="/ruta-aprendizaje" element={<LearnRoute />} />
              <Route path='/course/form' element={<CourseFormPage />} />
              <Route path='/course/:id/form' element={<CourseFormPage />} />
              <Route path='course/:courseId/section/form' element={<SectionFormPage />} />
              <Route path='course/:courseId/section/:sectionId/form' element={<SectionFormPage />} />
              <Route path="/recursos" element={<ResourcePage />} />
              <Route path='/course/section/content/:contentId' element={<ContentPage />} />
              <Route path="/course/section/content/:contentId/quiz" element={<QuizPage />} />
              <Route path='/courses/category/:categoryId' element={<CoursesPage activeByCategory={true} />} />

              {/* Rutas protegidas */}
              <Route element={<ProtectedRoute />}>
                <Route path="/resources/create" element={<CreateResourceForm />} />
              </Route>

              <Route path="/resources/:id/edit" element={<CreateResourceForm />} />
              <Route path="/resources/:id" element={<ResourceDetailsPage />} />
              <Route path="/roadmaps/:id" element={<Roadmap />} />

              <Route element={<ProtectedRouteAdmin allowedRoles={['superadmin', 'privileged']} />}>
                <Route path="/editor-roadmap" element={<ReactFlowProvider><RoadmapEditor /></ReactFlowProvider>} />
              </Route>

              <Route path="/editor-roadmap/:id" element={<ReactFlowProvider><RoadmapEditor /></ReactFlowProvider>} />
              <Route path="/sobre-nosotros" element={<AboutUs />} />
              
              {/* Usar el componente Dashboard directamente */}
              <Route path="/dashboard" element={<DashboardContainer />} />
              
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
              
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

                      ]}
                      notifications={[
                        { id: 1, message: "Nuevo estudiante", time: "hace 5m" }
                      ]}
                      assignments={[
                        { id: 1, title: "Proyecto Final", dueDate: "2023-12-15", submissions: 12 }
                      ]}
                      calendarEvents={[
                        { id: 1, title: "Webinar", date: "2023-12-05", time: "18:00" }
                      ]}
                      students={[
                        { 
                          id: 1, 
                          name: "Juan Pérez", 
                          email: "juan@example.com", 
                          enrolledCourses: 2, 
                          progress: 75, 
                          lastActive: "2023-11-30", 
                          status: "active",
                          avatar: "https://randomuser.me/api/portraits/men/1.jpg"
                        }
                      ]}
                      revenueData={{
                        thisMonth: 5200,
                        lastMonth: 4800,
                        growth: 8.33
                      }}
                      systemStats={{
                        totalUsers: 580,
                        activeCourses: 12,
                        totalRevenue: 28500
                      }}
                    />
                  </div>
                } 
              />
              
              <Route path="/not-found" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
              
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
