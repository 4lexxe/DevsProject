import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

//Importacion de todos los estilos
import './styles/main.css'

import DefaultLayout from './shared/layouts/defaultLayout'
import Home from './home/home'

import CoursesPage from './course/course'
import CourseDetail from './course/components/courseDetail'
import QuizPage from './course/components/QuizPage'

function App() { 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />

          <Route path="cursos" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/quiz/:contentId" element={<QuizPage />} />
        </Route>
      </Routes>
    </Router> 
  )
}

export default App

