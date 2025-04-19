import React from 'react';
import { CalendarEvent } from '../types';
import { Calendar as CalendarIcon, BookOpen, FileText, Award, Users } from 'lucide-react';

interface CalendarProps {
  events: CalendarEvent[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get the first day of the month
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  
  // Get the number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Create array of day numbers
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Create array for empty cells before the first day
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i);
  
  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });
  };
  
  // Get event icon based on type
  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class':
        return <BookOpen size={14} className="text-blue-500" />;
      case 'assignment':
        return <FileText size={14} className="text-yellow-500" />;
      case 'exam':
        return <Award size={14} className="text-red-500" />;
      case 'meeting':
        return <Users size={14} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          <div className="flex items-center">
            <CalendarIcon size={18} className="mr-2 text-blue-600" />
            {monthNames[currentMonth]} {currentYear}
          </div>
        </h2>
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-1 rounded hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="h-14 p-1"></div>
          ))}
          
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isToday = day === today.getDate() && 
                           currentMonth === today.getMonth() && 
                           currentYear === today.getFullYear();
            
            return (
              <div 
                key={`day-${day}`} 
                className={`h-14 p-1 border border-gray-100 rounded-md ${
                  isToday ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className={`text-xs font-medium ${
                  isToday ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {day}
                </div>
                <div className="mt-1 space-y-1 overflow-hidden max-h-10">
                  {dayEvents.slice(0, 2).map((event, index) => (
                    <div 
                      key={`event-${event.id}`} 
                      className="flex items-center text-xs truncate"
                      title={event.title}
                    >
                      {getEventIcon(event.type)}
                      <span className="ml-1 truncate">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Add Event
        </button>
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
          View Full Calendar
        </a>
      </div>
    </div>
  );
};

export default Calendar;