import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

import QuizPage from "./course/pages/QuizPage";
import { CoursesPage } from "@/course/index";
import { CourseFormPage } from "@/course/index";
import { CourseDetail } from "./course/index";

import { LoginPage, RegisterPage } from "./auth/auth";

import Profile from "./course/pages/Profile";

import LearnRoute from "./learnroute/pages/LearnRoute";

import ResourcePage from "./recourse/pages/resourcePages";
import RoadmapEditor from "./learnroute/components/RoadmapEditor";
import Roadmap from "./learnroute/pages/RoadMap";
import { Toaster } from 'react-hot-toast';


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
    <Router>
      <Toaster />
      <AuthProvider>
        {" "}
        {/* AuthProvider ahora está dentro del Router */}
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="cursos" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/quiz/:contentId" element={<QuizPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="course/form" element={<CourseFormPage />} />
            <Route path="/recursos" element={<ResourcePage />} />
            <Route 
              path="/ruta-aprendizaje" 
              element={
                <QueryClientProvider client={queryClient}>
                  <LearnRoute />
                </QueryClientProvider>
              } 
            />
            
          <Route
              path="/roadmaps/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <Roadmap />
                </QueryClientProvider>
              }
            />


            <Route
              path="/editor-roadmap"
              element={
                <ReactFlowProvider>
                  <RoadmapEditor />
                </ReactFlowProvider>
              }
            />
            <Route path="/editor-roadmap/:id" 
              element={
                <ReactFlowProvider>
                  <RoadmapEditor />
                </ReactFlowProvider>
              } 
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
