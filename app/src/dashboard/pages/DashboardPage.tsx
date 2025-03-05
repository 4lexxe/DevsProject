import React from 'react';
import Dashboard from '../components/Dashboard';
import { 
  currentUser, 
  courses, 
  notifications, 
  assignments, 
  calendarEvents,
  students,
  revenueData,
  systemStats
} from '../data/mockData';

const DashboardPage: React.FC = () => {
  return (
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
  );
};

export default DashboardPage;