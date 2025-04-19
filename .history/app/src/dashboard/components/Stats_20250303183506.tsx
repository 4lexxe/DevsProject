import React from 'react';
import { Users, BookOpen, GraduationCap, DollarSign, Activity, UserPlus, BookPlus, Award } from 'lucide-react';
import { SystemStats } from '../types';

interface StatsProps {
  stats: SystemStats;
}

const Stats: React.FC<StatsProps> = ({ stats }) => {
  const statItems = [
    {
      title: 'Total Students',
      value: stats.totalStudents.toLocaleString(),
      icon: <Users size={20} className="text-blue-600" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses.toLocaleString(),
      icon: <BookOpen size={20} className="text-purple-600" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Instructors',
      value: stats.totalInstructors.toLocaleString(),
      icon: <GraduationCap size={20} className="text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={20} className="text-green-600" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: <Activity size={20} className="text-indigo-600" />,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'New Users Today',
      value: stats.newUsersToday.toLocaleString(),
      icon: <UserPlus size={20} className="text-pink-600" />,
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      title: 'New Courses This Month',
      value: stats.coursesCreatedThisMonth.toLocaleString(),
      icon: <BookPlus size={20} className="text-orange-600" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: <Award size={20} className="text-teal-600" />,
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <div 
          key={index} 
          className={`${stat.bgColor} p-4 rounded-lg shadow-sm`}
        >
          <div className="flex items-center">
            <div className="mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;