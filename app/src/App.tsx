import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./user/contexts/AuthContext";
import { ReactFlowProvider } from "reactflow";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Importación de los componentes
import DefaultLayout from "./shared/layouts/defaultLayout";
import Home from "./home/home";

import "@/shared/assets/styles/main.css";

import { CoursesPage, CourseFormPage, CourseDetail, QuizPage, Profile, SectionFormPage, ContentPage }from '@/course/index';

import { LoginPage, RegisterPage } from "./user/auth";
import AboutUs from "./shared/components/navigation/AboutUs";

import LearnRoute from './learnroute/pages/LearnRoute';
import ResourcePage from './recourse/pages/resources/resourcePages';
import CreateResourceForm from './recourse/pages/form/CreateResourceForm';
import ResourceDetailsPage from './recourse/pages/resourceDetails/ResourceDetailsPage';
import ProtectedRoute from './user/contexts/ProtectedRoute'; // Importa el componente de protección
import ProtectedRouteAdmin from './user/contexts/ProtectRouteAdmin';

import RoadmapEditor from "./learnroute/components/RoadmapEditor";
import Roadmap from "./learnroute/pages/RoadMap";
import { Toaster } from 'react-hot-toast';
import NotFound from "./shared/components/NotFound";

import { PlansPage, SuccessPage, MySuscription, DetailsFormPage } from "./subscription/index";

import CartPage from "./payment/pages/CartPage";
import MyOrdersAndPayments from "./payment/pages/MyOrdersAndPayments";
import MyCoursesPage from "./payment/pages/MyCourses";
import CourseDiscountEvent from "./payment/pages/CourseDiscountEvent";
import DiscountEventsList from "./payment/pages/DiscountEventsList";
import MyCourse from "./payment/pages/MyCourse";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    },
  },
});


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
              <Route path='/course/:courseId/section/content/:contentId' element={<ContentPage />} />
              <Route path="/course/section/content/:contentId/quiz" element={<QuizPage />} />
              <Route path='/courses/category/:categoryId' element={<CoursesPage activeByCategory={true} />} />
              
              
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/subscription/success" element={<SuccessPage />} />
              <Route path="/subscription" element={<MySuscription />} />
              <Route path="/subscription/plan/:id/form/details" element={<DetailsFormPage />} />

              {/* Rutas de pago y carrito */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/user/orders" element={<MyOrdersAndPayments />} />
              <Route path="/my-courses" element={<MyCoursesPage />} />
              <Route path="/discount-events" element={<DiscountEventsList />} />
              <Route path="/discount-events/create" element={<CourseDiscountEvent />} />
              <Route path="/discount-events/edit" element={<CourseDiscountEvent />} />
              <Route path="/my-course/:id" element={<MyCourse />} />
              {/* Rutas públicas */}

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
