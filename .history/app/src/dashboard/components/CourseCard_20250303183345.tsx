import React from 'react';
import { Course } from '../types';
import { Users, Star, DollarSign, MoreVertical } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`text-xs px-2 py-1 rounded-full text-white ${
            course.status === 'active' ? 'bg-green-500' :
            course.status === 'draft' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}>
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{course.title}</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">Instructor: {course.instructor}</p>
        <p className="text-xs text-gray-500 mt-1">{course.duration} • {course.category}</p>
        
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <Users size={14} className="mr-1 text-blue-500" />
              <span>{course.enrolledStudents}</span>
            </div>
            <span>Students</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <Star size={14} className="mr-1 text-yellow-500" />
              <span>{course.rating > 0 ? course.rating.toFixed(1) : 'N/A'}</span>
            </div>
            <span>Rating</span>
          </div>
          
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <DollarSign size={14} className="mr-1 text-green-500" />
              <span>${course.revenue.toLocaleString()}</span>
            </div>
            <span>Revenue</span>
          </div>
        </div>
        
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
            Edit Course
          </button>
          <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;