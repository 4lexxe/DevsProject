import React from 'react';
import { User, Course, Notification, Assignment, CalendarEvent, Student, Revenue, SystemStats } from '../types';
import Sidebar from './Sidebar';
import CourseCard from './CourseCard';
import AssignmentList from './AssignmentList';
import Calendar from './Calendar';
import Stats from './Stats';
import StudentsList from './StudentsList';
import RevenueChart from './RevenueChart';

interface DashboardProps {
  user: User;
  courses: Course[];
  notifications: Notification[];
  assignments: Assignment[];
  calendarEvents: CalendarEvent[];
  students: Student[];
  revenueData: Revenue[];
  systemStats: SystemStats;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  courses,
  assignments,
  calendarEvents,
  students,
  revenueData,
  systemStats
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
            
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueChart data={revenueData} />
              </div>
              <div>
                <Calendar events={calendarEvents} />
              </div>
            </div>
            
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                  Add New Course
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {courses.slice(0, 4).map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudentsList students={students} />
              <AssignmentList assignments={assignments} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;