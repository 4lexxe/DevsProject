import { Outlet } from 'react-router-dom'
import Navbar from '../views/components/navigation/Navbar'
import Footer from '../views/components/navigation/Footer'

export default function DefaultLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}