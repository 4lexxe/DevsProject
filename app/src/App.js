import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import { AuthProvider } from "./user/contexts/AuthContext";
import { ReactFlowProvider } from "reactflow";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Importación de los componentes
import DefaultLayout from "./shared/layouts/defaultLayout";
import Home from "./home/home";
import "@/shared/assets/styles/main.css";
import { CoursesPage, CourseDetail, QuizPage, Profile, ContentPage, SearchResultsPage } from '@/course/index';
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
// Componente de depuración temporal
const DebugNavigationInterceptor = () => {
    React.useEffect(() => {
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;
        window.history.pushState = function (state, title, url) {
            console.log('🚨 NAVEGACIÓN DETECTADA - pushState:', url, 'Stack trace:', new Error().stack);
            if (url && url.toString().includes('undefined')) {
                console.error('❌ NAVEGACIÓN CON UNDEFINED DETECTADA:', url);
                console.trace('Stack trace completo:');
            }
            return originalPushState.apply(this, arguments);
        };
        window.history.replaceState = function (state, title, url) {
            console.log('🚨 NAVEGACIÓN DETECTADA - replaceState:', url, 'Stack trace:', new Error().stack);
            if (url && url.toString().includes('undefined')) {
                console.error('❌ NAVEGACIÓN CON UNDEFINED DETECTADA:', url);
                console.trace('Stack trace completo:');
            }
            return originalReplaceState.apply(this, arguments);
        };
        return () => {
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
        };
    }, []);
    return null;
};
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
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsxs(Router, { children: [_jsx(DebugNavigationInterceptor, {}), _jsx(Toaster, {}), _jsx(AuthProvider, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(DefaultLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) }), _jsx(Route, { path: "cursos", element: _jsx(CoursesPage, {}) }), _jsx(Route, { path: "/search", element: _jsx(SearchResultsPage, {}) }), _jsx(Route, { path: "/course/:id", element: _jsx(CourseDetail, {}) }), _jsx(Route, { path: "login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/ruta-aprendizaje", element: _jsx(LearnRoute, {}) }), _jsx(Route, { path: "/recursos", element: _jsx(ResourcePage, {}) }), _jsx(Route, { path: '/course/:courseId/section/content/:contentId', element: _jsx(ContentPage, {}) }), _jsx(Route, { path: "/course/section/content/:contentId/quiz", element: _jsx(QuizPage, {}) }), _jsx(Route, { path: '/courses/category/:categoryId', element: _jsx(CoursesPage, { activeByCategory: true }) }), _jsx(Route, { path: "/plans", element: _jsx(PlansPage, {}) }), _jsx(Route, { path: "/subscription/success", element: _jsx(SuccessPage, {}) }), _jsx(Route, { path: "/subscription", element: _jsx(MySuscription, {}) }), _jsx(Route, { path: "/subscription/plan/:id/form/details", element: _jsx(DetailsFormPage, {}) }), _jsx(Route, { path: "/cart", element: _jsx(CartPage, {}) }), _jsx(Route, { path: "/user/orders", element: _jsx(MyOrdersAndPayments, {}) }), _jsx(Route, { path: "/my-courses", element: _jsx(MyCoursesPage, {}) }), _jsx(Route, { path: "/discount-events", element: _jsx(DiscountEventsList, {}) }), _jsx(Route, { path: "/discount-events/create", element: _jsx(CourseDiscountEvent, {}) }), _jsx(Route, { path: "/discount-events/edit", element: _jsx(CourseDiscountEvent, {}) }), _jsx(Route, { path: "/my-course/:id", element: _jsx(MyCourse, {}) }), _jsx(Route, { element: _jsx(ProtectedRoute, {}), children: _jsx(Route, { path: "/resources/create", element: _jsx(CreateResourceForm, {}) }) }), _jsx(Route, { path: "/resources/:id/edit", element: _jsx(CreateResourceForm, {}) }), _jsx(Route, { path: "/resources/:id", element: _jsx(ResourceDetailsPage, {}) }), _jsx(Route, { path: "/roadmaps/:id", element: _jsx(Roadmap, {}) }), _jsx(Route, { element: _jsx(ProtectedRouteAdmin, { allowedRoles: ['superadmin', 'privileged'] }), children: _jsx(Route, { path: "/editor-roadmap", element: _jsx(ReactFlowProvider, { children: _jsx(RoadmapEditor, {}) }) }) }), _jsx(Route, { path: "/editor-roadmap/:id", element: _jsx(ReactFlowProvider, { children: _jsx(RoadmapEditor, {}) }) }), _jsx(Route, { path: "/sobre-nosotros", element: _jsx(AboutUs, {}) }), _jsx(Route, { path: "/not-found", element: _jsx(NotFound, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) })] }) }));
}
export default App;
