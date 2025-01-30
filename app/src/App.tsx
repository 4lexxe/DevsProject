import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/contexts/AuthContext';

// Importación de todos los estilos
import '@/styles/main.css';

// Importación de los componentes
import DefaultLayout from './shared/layouts/defaultLayout';
import Home from './home/home';

import CoursesPage from './course/course';
import CourseDetail from './course/components/courseDetail';
import QuizPage from './course/components/QuizPage';

import { LoginPage, RegisterPage } from './auth/auth';

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider ahora está dentro del Router */}
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />

            <Route path="cursos" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/quiz/:contentId" element={<QuizPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;