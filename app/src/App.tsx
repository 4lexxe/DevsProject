import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DefaultLayout from './layouts/defaultLayout'
import Home from './views/home'
import CoursesPage from './views/courses'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="cursos" element={<CoursesPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

