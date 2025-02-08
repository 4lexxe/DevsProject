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

import Profile from './course/pages/Profile';

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

            <Route path='course/form' element = {<CourseFormPage/>} />

            
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;