import React, { useEffect, useState } from 'react';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../../auth/contexts/AuthContext'; // Ajusta la ruta según tu estructura
import { fetchCourses, fetchNotifications, fetchAssignments, fetchCalendarEvents, fetchStudents, fetchRevenueData, fetchSystemStats } from '../../services/api'; // Ajusta según tus servicios API

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth(); // Asume que tienes un contexto de autenticación
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [revenueData, setRevenueData] = useState({});
  const [systemStats, setSystemStats] = useState({});

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Carga todos los datos necesarios para el dashboard
        const [
          coursesData,
          notificationsData,
          assignmentsData,
          calendarEventsData,
          studentsData,
          revenueData,
          systemStatsData
        ] = await Promise.all([
          fetchCourses(),
          fetchNotifications(),
          fetchAssignments(),
          fetchCalendarEvents(),
          fetchStudents(),
          fetchRevenueData(),
          fetchSystemStats()
        ]);

        setCourses(coursesData);
        setNotifications(notificationsData);
        setAssignments(assignmentsData);
        setCalendarEvents(calendarEventsData);
        setStudents(studentsData);
        setRevenueData(revenueData);
        setSystemStats(systemStatsData);
        
      } catch (err) {
        console.error("Error cargando datos del dashboard:", err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <Dashboard 
        user={currentUser}
        courses={courses}
        notifications={notifications}
        assignments={assignments}
        calendarEvents={calendarEvents}
        students={students}
        revenueData={revenueData}
        systemStats={systemStats}
      />
    </div>
  );
};

export default DashboardPage;
