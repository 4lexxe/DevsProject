import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/contexts/AuthContext';
// Importación de todos los estilos
import '@/shared/assets/styles/main.css';
// Importación de los componentes
import DefaultLayout from './shared/layouts/defaultLayout';

import SearchPage from './search/pages/SearchPage';

import Home from './home/home';

import { CoursesPage, CourseFormPage, CourseDetail, QuizPage, Profile, SectionsFormPage }from '@/course/index';

import { LoginPage, RegisterPage } from './auth/auth';

import LearnRoute from './learnroute/pages/LearnRoute';
import ResourcePage from './recourse/pages/resources/resourcePages';
import CreateResourceForm from './recourse/pages/form/CreateResourceForm';
import ResourceDetailsPage from './recourse/pages/resourceDetails/ResourceDetailsPage';
import ProtectedRoute from './auth/contexts/ProtectedRoute'; // Importa el componente de protección

function App() {
  return (
    <Router>
      <AuthProvider> {/* AuthProvider ahora está dentro del Router */}
        <Routes>
          <Route path="/" element={<DefaultLayout />}>
            <Route path="/search" element={<SearchPage />} />
            <Route index element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="cursos" element={<CoursesPage />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/quiz/:contentId" element={<QuizPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="/ruta-aprendizaje" element={< LearnRoute/>} />            
            <Route path='course/form' element = {<CourseFormPage/>} />
            <Route path='course/sections/form' element = { <SectionsFormPage/> } />
            <Route path="/recursos" element={<ResourcePage />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/resources/create" element={<CreateResourceForm />} />
            </Route>

            <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;