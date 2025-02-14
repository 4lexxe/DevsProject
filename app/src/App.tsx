import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/contexts/AuthContext';

// Importación de todos los estilos
import '@/shared/assets/styles/main.css';

// Importación de los componentes
import DefaultLayout from './shared/layouts/defaultLayout';
import Home from './home/home';

import QuizPage from './course/pages/QuizPage';
import { CoursesPage }from '@/course/index';
import { CourseFormPage } from '@/course/index';
import {CourseDetail} from './course/index';

import { LoginPage, RegisterPage } from './auth/auth';

import Profile from './profile/Profile';

import LearnRoute from './learnroute/pages/LearnRoute';

import ResourcePage from './recourse/pages/resourcePages';

import CreateResourceForm from './recourse/pages/form/CreateResourceForm';

import ResourceDetailsPage from   './recourse/pages/resourceDetails/ResourceDetailsPage';


function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider ahora está dentro del Router */}
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
            <Route path="/ruta-aprendizaje" element={< LearnRoute/>} />            <Route path='course/form' element = {<CourseFormPage/>} />
            <Route path="/recursos" element={<ResourcePage />} />
            <Route path="/resources/create" element={<CreateResourceForm />} />

            <Route path="/resources/:id" element={<ResourceDetailsPage />} />
            
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;