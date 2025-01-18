import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultLayout from './layouts/defaultLayout'
import Home from './views/Pages/home'
import CoursesPage from './views/Pages/courses'
import CourseDetail from './views/Pages/courseDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="cursos" element={<CoursesPage />} />
          <Route path="/course/:id" element={<CourseDetail />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

